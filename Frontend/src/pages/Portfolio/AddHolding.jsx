import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { PieChart, Pie, Cell, Tooltip } from "recharts";

// ICONS IMPORT
import { LuChevronRight, LuSearch, LuX, LuChevronDown, LuCalendar, LuPlus, LuTrash2, LuInfo, LuCheck, LuUsers, LuBuilding2, LuLoaderCircle, LuCircleAlert, LuArrowRight, LuBadgeCheck, LuRefreshCw, LuShieldCheck, LuFileCheck2, LuCircleCheckBig, LuClipboardList, LuLayers2, LuCircleCheck, LuFileX2 } from "react-icons/lu";
import { HiCheckCircle } from "react-icons/hi";
import { TbAlertOctagonFilled } from "react-icons/tb";

import { AddHoldingButton, Cancel } from "../../components/button";

export default function AddHolding() {

    const navigate = useNavigate();
    const DRAFT_KEY = "wealthtrack_add_holding_draft";

    const [quantity, setQuantity] = useState("");
    const [buyPrice, setBuyPrice] = useState("");
    const [buyDate, setBuyDate] = useState("");
    const [sellPrice, setSellPrice] = useState("");
    const [sellDate, setSellDate] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    
    const [tradeStatus, setTradeStatus] = useState("OPEN");
    
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const [allocationType, setAllocationType] = useState("ALL");

    const [clientSearch, setClientSearch] = useState("");
    const [allClients, setAllClients] = useState([]);
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
    const clientDropdownRef = useRef(null);
    const [selectedClientIds, setSelectedClientIds] = useState([]);
    const [hasManualAllocationChanges, setHasManualAllocationChanges] = useState(false);
    const [isDraftLoaded, setIsDraftLoaded] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const skipInitialBuyDateRefresh = useRef(false);
    
    const clientSearchRef = useRef(null);
    const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
    const [addCompanyStep, setAddCompanyStep] = useState("ticker");

    const [newCompanyTicker, setNewCompanyTicker] = useState("");
    const [fetchedCompany, setFetchedCompany] = useState(null);
    const [fetchingStage, setFetchingStage] = useState(0);
    
    const isStep1 =
        addCompanyStep === "ticker";

    const isStep2 =
        addCompanyStep === "fetching" ||
        addCompanyStep === "not-found";

    const isStep3 =
        addCompanyStep === "found" ||
        addCompanyStep === "added" ||
        addCompanyStep === "add-failed";

    const companyAdded =
        addCompanyStep === "added";

    const companyAddFailed =
        addCompanyStep === "add-failed";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                clientSearchRef.current &&
                !clientSearchRef.current.contains(event.target)
            ) {
                setClientSearch("");
                setIsClientDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {

        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const searchStocks = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    `http://localhost:8000/api/stocks?q=${encodeURIComponent(searchTerm)}`
                );

                const data = await response.json();

                setSearchResults(data);

            } catch (error) {

                console.error("Stock search error:", error);
                setSearchResults([]);

            } finally {

                setLoading(false);

            }
        };

        const timeout = setTimeout(searchStocks, 300);

        return () => clearTimeout(timeout);

    }, [searchTerm]);



    const handleSelectCompany = (company) => {
        setSelectedCompany(company);
        setSearchTerm("");
        setSearchResults([]);
    };

    const handleRemoveCompany = () => {
        setSelectedCompany(null);
        setBuyPrice("");
        setQuantity("");
        setBuyDate("");
        setSellPrice("");
        setSellDate("");
        setTradeStatus("OPEN");
        setShowStatusDropdown(false);
        setHasManualAllocationChanges(false);

        setAllClients(prev =>
            prev.map(client => ({
                ...client,
                suggestedQuantity: 0,
                allocatedQuantity: 0,
                maxAllocatable: 0
            }))
        );
    };

    
    const totalQuantity = Number(quantity) || 0;

    const isValidBuyPrice =
        buyPrice !== "" &&
        Number.isFinite(Number(buyPrice)) &&
        Number(buyPrice) > 0;

    const isValidQuantity =
        quantity !== "" &&
        Number.isInteger(Number(quantity)) &&
        Number(quantity) > 0;

    const isValidBuyDate = Boolean(buyDate);

    const isValidSellDetails =
        tradeStatus !== "CLOSED" ||
        (
            sellPrice !== "" &&
            Number.isFinite(Number(sellPrice)) &&
            Number(sellPrice) > 0 &&
            Boolean(sellDate) &&
            (!buyDate || sellDate >= buyDate)
        );

    const tradeDetailsReady =
        Boolean(selectedCompany) &&
        isValidBuyPrice &&
        isValidQuantity &&
        isValidBuyDate;

    const allocationReady =
        tradeDetailsReady &&
        isValidSellDetails;

    const getMaxShares = (client) => {
        if (!buyPrice || !client.uninvestedAmount) {
            return 0;
        }

        return Math.floor(
            client.uninvestedAmount / Number(buyPrice)
        );
    };

    const selectedClients = allClients.filter(client =>
        selectedClientIds.includes(client.id)
    );

    const clientsForAllocation =
        allocationType === "ALL"
            ? allClients
            : selectedClients;

    const clientsForTable =
        allocationType === "ALL"
            ? allClients.filter(client =>
                client.name
                    .toLowerCase()
                    .startsWith(clientSearch.trim().toLowerCase())
            )
            : selectedClients;

    const allocatedQuantity = clientsForAllocation.reduce(
        (total, client) =>
            total + Number(client.allocatedQuantity || 0),
        0
    );

    const unallocatedQuantity = totalQuantity - allocatedQuantity;

    const allocatedPercentage =
        totalQuantity > 0
            ? (allocatedQuantity / totalQuantity) * 100
            : 0;

    const unallocatedPercentage =
        totalQuantity > 0
            ? Math.max(0, unallocatedQuantity / totalQuantity * 100)
            : 0;

    const clientAllocationData = clientsForAllocation
        .filter(client => Number(client.allocatedQuantity || 0) > 0)
        .map(client => ({
            name: client.name,
            allocatedQuantity: Number(client.allocatedQuantity || 0)
        }));

    const handleAllClientQuantityChange = (clientId, value) => {
        setHasManualAllocationChanges(true);

        setAllClients(prev =>
            prev.map(client => {
                if (client.id !== clientId) return client;

                if (value === "") {
                    return {
                        ...client,
                        allocatedQuantity: ""
                    };
                }

                const numericValue = Number(value);

                const safeValue = Math.max(
                    0,
                    Math.min(numericValue, client.maxAllocatable)
                );

                return {
                    ...client,
                    allocatedQuantity: safeValue
                };
            })
        );
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;

        if (value !== "" && !/^\d+$/.test(value)) {
            return;
        }

        setQuantity(value);
    };

    const handleSpecificClientQuantityChange = (clientId, value) => {
        setHasManualAllocationChanges(true);

        setAllClients(prev =>
            prev.map(client => {
                if (client.id !== clientId) return client;

                if (value === "") {
                    return {
                        ...client,
                        allocatedQuantity: ""
                    };
                }

                const numericValue = Number(value);

                const safeValue = Math.max(
                    0,
                    Math.min(numericValue, client.maxAllocatable)
                );

                return {
                    ...client,
                    allocatedQuantity: safeValue
                };
            })
        );
    };

    const section1Complete = Boolean(selectedCompany);

    const section2Complete =
        section1Complete &&
        Number(buyPrice) > 0 &&
        Number.isInteger(Number(quantity)) &&
        Number(quantity) > 0 &&
        Boolean(buyDate) &&
        (
            tradeStatus === "OPEN" ||
            (
                Number(sellPrice) > 0 &&
                Boolean(sellDate) &&
                sellDate >= buyDate
            )
        );

    const section3Complete =
        section2Complete &&
        allocatedQuantity === totalQuantity &&
        totalQuantity > 0;

    const section2Enabled = section1Complete;
    const section3Enabled = section2Complete;

    const handleSelectSpecificClient = (clientId) => {
    setSelectedClientIds(prev =>
        prev.includes(clientId)
            ? prev
            : [...prev, clientId]
    );
};

    const handleRemoveSpecificClient = (clientId) => {
        setSelectedClientIds(prev =>
            prev.filter(id => id !== clientId)
        );

        setAllClients(prev =>
            prev.map(client =>
                client.id === clientId
                    ? {
                        ...client,
                        suggestedQuantity: 0,
                        allocatedQuantity: 0
                    }
                    : client
            )
        );
    };

    const openAddCompanyModal = () => {
        setNewCompanyTicker("");
        setFetchedCompany(null);
        setAddCompanyStep("ticker");
        setShowAddCompanyModal(true);
    };


    const closeAddCompanyModal = () => {
        setShowAddCompanyModal(false);
        setNewCompanyTicker("");
        setFetchedCompany(null);
        setAddCompanyStep("ticker");
    };


    const handleFetchCompanyDetails = async () => {

        const ticker = newCompanyTicker.trim().toUpperCase();

        if (!ticker) {
            return;
        }

        setAddCompanyStep("fetching");

        try {

            setFetchingStage(0);

            // Give Stage 1 time to display
            await new Promise(resolve => setTimeout(resolve, 1200));

            setFetchingStage(1);

            // Give Stage 2 time to display
            await new Promise(resolve => setTimeout(resolve, 1200));

            // REAL BACKEND REQUEST
            const response = await fetch(
                `http://localhost:8000/api/stocks/lookup?ticker=${encodeURIComponent(ticker)}`
            );

            if (!response.ok) {
                throw new Error("Company not found");
            }

            const data = await response.json();

            setFetchingStage(2);

            // Small delay so Stage 3 can visibly complete
            await new Promise(resolve => setTimeout(resolve, 1200));

            setFetchedCompany(data);
            setAddCompanyStep("found");

        } catch (error) {

            console.error("❌ COMPANY FETCH ERROR:", error);

            setFetchedCompany(null);
            setAddCompanyStep("not-found");

        }
    };

    const handleAddCompany = async () => {

        if (!fetchedCompany) {
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8000/api/stocks",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(fetchedCompany)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to add company");
            }

            console.log("✅ COMPANY ADDED:", data);

            setAddCompanyStep("added");

        } catch (error) {

            console.error("❌ COMPANY ADD ERROR:", error);

            setAddCompanyStep("add-failed");

        }

    };

    const handleTryAgain = () => {
        setAddCompanyStep("ticker");
    };

    // INITIALIZE PAGE — RESTORE DRAFT + FETCH CLIENTS
    useEffect(() => {
        const initializePage = async () => {
            let savedDraft = null;

            // 1. Read saved draft
            try {
                const rawDraft = localStorage.getItem(DRAFT_KEY);

                if (rawDraft) {
                    savedDraft = JSON.parse(rawDraft);
                }
            } catch (error) {
                console.error("Failed to restore trade draft:", error);
                localStorage.removeItem(DRAFT_KEY);
            }

            // 2. Restore trade details
            if (savedDraft) {
                
                skipInitialBuyDateRefresh.current = Boolean(savedDraft.buyDate);

                setQuantity(savedDraft.quantity || "");
                setBuyPrice(savedDraft.buyPrice || "");
                setBuyDate(savedDraft.buyDate || "");
                setSellPrice(savedDraft.sellPrice || "");
                setSellDate(savedDraft.sellDate || "");

                setSelectedCompany(savedDraft.selectedCompany || null);
                setTradeStatus(savedDraft.tradeStatus || "OPEN");
                setAllocationType(savedDraft.allocationType || "ALL");

                setHasManualAllocationChanges(
                    savedDraft.hasManualAllocationChanges || false
                );
            }

            // 3. Fetch fresh clients from database
            try {
                const response = await fetch(
                    `http://localhost:8000/api/stocks/clients?buyDate=${encodeURIComponent(
                        savedDraft?.buyDate || ""
                    )}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch clients");
                }

                const data = await response.json();

                const clients = data.map(client => ({
                    id: client.id,
                    clientId: client.client_id,
                    name: `${client.first_name} ${client.last_name}`,

                    startDate: client.start_date,

                    portfolioRatio: Number(client.portfolio_ratio),
                    uninvestedAmount: Number(client.uninvested_amount),

                    allocationRatio: 0,

                    suggestedQuantity: 0,
                    maxAllocatable: 0,
                    allocatedQuantity: 0
                }));

                // 4. If draft contains allocations,
                //    merge them with the fresh DB client data
                if (savedDraft?.allClients) {
                    const savedClients = new Map(
                        savedDraft.allClients.map(client => [
                            client.id,
                            client
                        ])
                    );

                    const restoredClients = clients.map(client => {
                        const savedClient = savedClients.get(client.id);

                        if (!savedClient) {
                            return client;
                        }

                        const currentMaxAllocatable =
                            buyPrice || savedDraft.buyPrice
                                ? Math.floor(
                                    client.uninvestedAmount /
                                    Number(buyPrice || savedDraft.buyPrice)
                                )
                                : 0;

                        return {
                            ...client,

                            // Keep fresh DB data for these
                            portfolioRatio: client.portfolioRatio,
                            uninvestedAmount: client.uninvestedAmount,

                            // Restore draft allocation
                            suggestedQuantity: Math.min(
                                Number(savedClient.suggestedQuantity) || 0,
                                currentMaxAllocatable
                            ),

                            allocatedQuantity: Math.min(
                                Number(savedClient.allocatedQuantity) || 0,
                                currentMaxAllocatable
                            ),

                            // Recalculate using current account data
                            maxAllocatable: currentMaxAllocatable
                        };
                    });

                    setAllClients(restoredClients);
                } else {
                    setAllClients(clients);
                }

            } catch (error) {
                console.error("Client fetch error:", error);

                // If API fails but a draft exists,
                // don't destroy the saved allocation
                setAllClients([]);
                setSelectedClientIds([]);
            } finally {
                // IMPORTANT:
                // Don't allow the save effect to run
                // until restoration + client loading is finished.
                setIsDraftLoaded(true);
            }
        };

        initializePage();
    }, []);

    // REFRESH CLIENTS WHEN BUY DATE CHANGES
    useEffect(() => {
        if (!isDraftLoaded) return;
        if (!buyDate) return;

        // If the buy date came from a restored draft,
        // initialization already fetched the correct clients.
        if (skipInitialBuyDateRefresh.current) {
            skipInitialBuyDateRefresh.current = false;
            return;
        }

        const refreshEligibleClients = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/stocks/clients?buyDate=${encodeURIComponent(
                        buyDate
                    )}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch eligible clients");
                }

                const data = await response.json();

                const eligibleClients = data.map(client => ({
                    id: client.id,
                    clientId: client.client_id,
                    name: `${client.first_name} ${client.last_name}`,

                    startDate: client.start_date,

                    portfolioRatio: Number(client.portfolio_ratio),
                    uninvestedAmount: Number(client.uninvested_amount),

                    allocationRatio: 0,
                    suggestedQuantity: 0,
                    maxAllocatable: 0,
                    allocatedQuantity: 0
                }));

                setAllClients(eligibleClients);

                // Remove clients who are no longer eligible
                setSelectedClientIds(prev =>
                    prev.filter(id =>
                        eligibleClients.some(client => client.id === id)
                    )
                );

                // The eligible pool has changed,
                // so automatic allocation should be recalculated.
                setHasManualAllocationChanges(false);

            } catch (error) {
                console.error("Eligible client fetch error:", error);
            }
        };

        refreshEligibleClients();

    }, [buyDate, isDraftLoaded]);

    const calculateAllClientAllocations = (
        clients,
        totalQuantity,
        buyPrice
    ) => {
        if (!totalQuantity || !buyPrice || !clients.length) {
            return clients.map(client => ({
                ...client,
                suggestedQuantity: 0,
                maxAllocatable: 0,
                allocatedQuantity: 0
            }));
        }

        // 1. Calculate maximum shares each client can afford
        const clientsWithCapacity = clients.map(client => ({
            ...client,
            maxAllocatable: Math.floor(
                client.uninvestedAmount / Number(buyPrice)
            )
        }));

        // Total Uninvested Amount
        const totalUninvested = clientsWithCapacity.reduce(
            (total, client) =>
                total + Number(client.uninvestedAmount || 0),
            0
        );

        // Allocation Ratio
        const clientsWithRatio = clientsWithCapacity.map(client => {
            const allocationRatio =
                totalUninvested > 0
                    ? Number(client.uninvestedAmount || 0) / totalUninvested
                    : 0;

            return {
                ...client,
                allocationRatio
            };
        });

        // 2. Calculate the exact proportional allocation
        const clientsWithSuggested = clientsWithRatio.map(client => {
            const exactQuantity =
                totalQuantity * client.allocationRatio;

            return {
                ...client,
                exactQuantity
            };
        });

        // 3. Take the whole-number part first
        let allocated = clientsWithSuggested.map(client => ({
            ...client,
            suggestedQuantity: Math.min(
                Math.floor(client.exactQuantity),
                client.maxAllocatable
            ),
            allocatedQuantity: Math.min(
                Math.floor(client.exactQuantity),
                client.maxAllocatable
            )
        }));

        // 4. Find how many shares are still left after flooring
        let remainingShares =
            totalQuantity -
            allocated.reduce(
                (total, client) => total + client.allocatedQuantity,
                0
            );

        // 5. Sort by largest fractional remainder
        const sortedByRemainder = [...allocated].sort(
            (a, b) => {
                const remainderA =
                    a.exactQuantity - Math.floor(a.exactQuantity);

                const remainderB =
                    b.exactQuantity - Math.floor(b.exactQuantity);

                return remainderB - remainderA;
            }
        );

        // 6. Give remaining shares according to largest remainder,
        //    but only if the client still has capacity
        for (const client of sortedByRemainder) {

            if (remainingShares <= 0) {
                break;
            }

            if (client.allocatedQuantity < client.maxAllocatable) {
                client.allocatedQuantity += 1;
                remainingShares -= 1;
            }
        }

        return allocated.map(client => ({
            ...client,
            suggestedQuantity: client.allocatedQuantity,
            exactQuantity: undefined
        }));
    };

    useEffect(() => {
        if (!allClients.length) return;

        if (hasManualAllocationChanges) return;

        // ALL CLIENTS
        if (allocationType === "ALL") {
            const calculatedClients = calculateAllClientAllocations(
                allClients,
                totalQuantity,
                buyPrice
            );

            setAllClients(calculatedClients);
            return;
        }

        // SPECIFIC CLIENTS
        if (allocationType === "SPECIFIC") {
            if (!selectedClientIds.length) return;

            const selectedClients = allClients.filter(client =>
                selectedClientIds.includes(client.id)
            );

            const calculatedSelectedClients =
                calculateAllClientAllocations(
                    selectedClients,
                    totalQuantity,
                    buyPrice
                );

            // Merge calculated selected clients
            // back into the complete client list
            setAllClients(prevClients =>
                prevClients.map(client => {
                    const calculatedClient =
                        calculatedSelectedClients.find(
                            selected => selected.id === client.id
                        );

                    return calculatedClient || client;
                })
            );
        }
    }, [
        allocationType,
        totalQuantity,
        buyPrice,
        buyDate,
        selectedClientIds,
        allClients.length,
        hasManualAllocationChanges
    ]);

    useEffect(() => {
        if (!isDraftLoaded) return;

        const hasDraftContent =
            quantity ||
            buyPrice ||
            buyDate ||
            sellPrice ||
            sellDate ||
            selectedCompany ||
            allClients.some(
                client => Number(client.allocatedQuantity || 0) > 0
            );

        // Don't create an empty draft
        if (!hasDraftContent) {
            localStorage.removeItem(DRAFT_KEY);
            return;
        }

        const draft = {
            quantity,
            buyPrice,
            buyDate,
            sellPrice,
            sellDate,
            selectedCompany,
            tradeStatus,
            allocationType,
            allClients,
            hasManualAllocationChanges
        };

        localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify(draft)
        );
    }, [
        isDraftLoaded,
        quantity,
        buyPrice,
        buyDate,
        sellPrice,
        sellDate,
        selectedCompany,
        tradeStatus,
        allocationType,
        allClients,
        hasManualAllocationChanges
    ]);

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        
        // Remove saved draft
        localStorage.removeItem(DRAFT_KEY);

        // Reset trade details
        setQuantity("");
        setBuyPrice("");
        setBuyDate("");
        setSellPrice("");
        setSellDate("");

        // Reset company search
        setSearchTerm("");
        setSearchResults([]);
        setSelectedCompany(null);

        // Reset trade settings
        setTradeStatus("OPEN");
        setAllocationType("ALL");

        // Reset client allocation
        setClientSearch("");
        setHasManualAllocationChanges(false);

        setAllClients(prev =>
            prev.map(client => ({
                ...client,
                suggestedQuantity: 0,
                allocatedQuantity: 0,
                maxAllocatable: 0
            }))
        );

        // Close modal
        setShowCancelModal(false);

        // Navigate back
        navigate(-1);
    };

    return (
        <div className="flex flex-col gap-5">

            {/* MAIN LAYOUT */}

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_430px] gap-5 items-stretch">

                {/* LEFT SIDE */}

                <div className="bg-white rounded-xl border border-slate-200 p-5 min-w-0 flex flex-col justify-evenly">

                    {/* STEP 1 — SELECT COMPANY */}

                    <section>

                        <div className="flex items-start gap-3">

                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                1
                            </div>


                            <div>

                                <h2 className="font-bold text-slate-900">
                                    Select Company
                                </h2>

                                <p className="text-xs text-slate-500 mt-1">
                                    Search and select the company you want to buy
                                </p>

                            </div>

                        </div>


                        {/* Search */}
                        <div className="relative mt-4">

                            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                            <input
                                type="text"
                                value={searchTerm}
                                disabled={!!selectedCompany}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by company name or ticker..."
                                className="w-full h-11 pl-11 pr-4 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        {/* Search Results */}

            {searchTerm.trim() && !selectedCompany && (

                <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden bg-white">

                    {!loading && searchResults.length > 0 && (

                        <>

                            {searchResults.map((company) => (

                                <button
                                    key={company.id}
                                    type="button"
                                    onClick={() => handleSelectCompany(company)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                                >

                                    <div className="flex items-center gap-3">

                                        {company.logo_url ? (

                                            <img
                                                src={company.logo_url}
                                                alt=""
                                                className="w-10 h-10 rounded-full object-contain border border-slate-100"
                                            />

                                        ) : (

                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                {company.ticker?.slice(0, 4)}
                                            </div>

                                        )}


                                        <div>

                                            <h3 className="font-semibold text-sm text-slate-900">
                                                {company.company_name}
                                            </h3>

                                            <p className="text-xs text-slate-500 mt-1">
                                                {company.ticker}
                                                <span className="mx-2">•</span>
                                                {company.exchange}
                                                <span className="mx-2">•</span>
                                                {company.sector}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="text-right">

                                        <p className="text-sm font-semibold text-slate-900">
                                            ₹ {Number(company.current_price).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </p>

                                    </div>

                                </button>

                            ))}

                        </>

                    )}


                    {!loading && searchResults.length === 0 && (

                        <div className="px-4 py-4">

                            <p className="text-sm text-slate-600">
                                No company found
                            </p>

                            <button
                                type="button"
                                onClick={openAddCompanyModal}
                                className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                <LuPlus className="w-4 h-4" />
                                Add Company
                            </button>

                        </div>

                    )}

                </div>

            )}


            {/* Selected Company */}

            {selectedCompany && (

                <div className="mt-3 flex items-center justify-between border border-slate-200 rounded-lg p-3">

                    <div className="flex items-center gap-3">

                        {selectedCompany.logo_url ? (

                            <img
                                src={selectedCompany.logo_url}
                                alt=""
                                className="w-11 h-11 rounded-full object-contain border border-slate-100"
                            />

                        ) : (

                            <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {selectedCompany.ticker?.slice(0, 4)}
                            </div>

                        )}


                        <div>

                            <h3 className="font-semibold text-sm">
                                {selectedCompany.company_name}
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">

                                {selectedCompany.ticker}

                                <span className="mx-2">•</span>

                                {selectedCompany.exchange}

                                <span className="mx-2">•</span>

                                {selectedCompany.sector}

                            </p>

                        </div>

                    </div>


                    <div className="flex items-center gap-6">

                        <div className="text-right">

                            <p className="text-xs text-slate-500">
                                Current Price
                            </p>

                            <p className="font-semibold text-sm">
                                ₹ {Number(selectedCompany.current_price).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={handleRemoveCompany}
                            className="text-slate-400 hover:text-slate-700"
                        >
                            <LuX className="w-5 h-5" />
                        </button>

                    </div>

                </div>

            )}

        </section>


                    <div className="border-t border-slate-100 my-5" />

                    {/* STEP 2 — TRADE DETAILS */}

                    <section>

                        <div className="flex items-start gap-3">

                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                2
                            </div>


                            <div>

                                <h2 className="font-bold text-slate-900">
                                    Trade Details
                                </h2>

                                <p className="text-xs text-slate-500 mt-1">
                                    Enter the trade details for this holding
                                </p>

                            </div>

                        </div>

                        {/* Contents */}

                        {selectedCompany && (

                            <>

                                <div className="grid grid-cols-3 gap-4 mt-4">

                                    {/* Buy Price */}

                                    <div>

                                        <label className="text-xs font-semibold">
                                            Buy Price (₹) *
                                        </label>

                                        <div className="relative mt-2">

                                            <input
                                                type="number"
                                                min="0"
                                                value={buyPrice}
                                                onChange={(e) => setBuyPrice(e.target.value)}
                                                placeholder="Enter buy price"
                                                className="w-full h-10 border border-slate-200 rounded-lg px-3 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />

                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                ₹
                                            </span>

                                        </div>

                                    </div>

                                    {/* Quantity */}

                                    <div>

                                        <label className="text-xs font-semibold">
                                            Quantity (Shares) *
                                        </label>

                                        <div className="relative mt-2">

                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                                disabled={!isValidBuyPrice}
                                                placeholder="Enter quantity"
                                                className="w-full h-10 border border-slate-200 rounded-lg px-3 pr-16 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />

                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                                Shares
                                            </span>

                                        </div>

                                    </div>

                                    {/* Buy Date */}

                                    <div>

                                        <label className="text-xs font-semibold">
                                            Buy Date *
                                        </label>

                                        <div className="relative mt-2">

                                            <LuCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                            <input
                                                type="date"
                                                value={buyDate}
                                                onChange={(e) => setBuyDate(e.target.value)}
                                                className="w-full h-10 border border-slate-200 rounded-lg pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* TRADE STATUS */}

                                <div className="mt-4">

                                    <label className="text-xs font-semibold">
                                        Trade Status *
                                    </label>


                                    <div className="relative mt-2">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowStatusDropdown(!showStatusDropdown)
                                            }
                                            disabled={!tradeDetailsReady}
                                            className="w-full h-11 flex items-center justify-between border border-slate-200 rounded-lg px-3 text-sm hover:border-slate-300"
                                        >

                                            <span className="flex items-center gap-2">

                                                <span className={` w-2 h-2 rounded-full
                                                    ${
                                                        tradeStatus === "OPEN"
                                                            ? "bg-green-500"
                                                            : "bg-slate-500"
                                                    }
                                                `} />

                                                {tradeStatus === "OPEN"
                                                    ? "Open"
                                                    : "Closed"
                                                }

                                            </span>


                                            <LuChevronDown className="w-4 h-4" />

                                        </button>

                                        {/* Status Dropdown */}

                                        {showStatusDropdown && (

                                            <div className="absolute top-12 left-0 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                    setTradeStatus("OPEN");
                                                    setSellPrice("");
                                                    setSellDate("");
                                                    setShowStatusDropdown(false);
                                                }}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left hover:bg-slate-50"
                                                >

                                                    <span className="w-2 h-2 rounded-full bg-green-500" />

                                                    Open

                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setTradeStatus("CLOSED");
                                                        setShowStatusDropdown(false);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-left hover:bg-slate-50 "
                                                >

                                                    <span className="w-2 h-2 rounded-full bg-slate-500" />

                                                    Closed

                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </div>

                                {/* OPEN MESSAGE */}

                                {tradeStatus === "OPEN" && (

                                    <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-md bg-blue-50 border border-blue-200 text-xs text-blue-700">

                                        <LuInfo className="w-4 h-4 shrink-0" />

                                        This is an open position. You can close it later
                                        by adding a sell transaction.

                                    </div>

                                )}

                                {/* CLOSED DETAILS */}

                                {tradeStatus === "CLOSED" && (

                                    <div className="mt-3 border border-slate-200 rounded-lg p-4 bg-slate-50/50">

                                        <div className="grid grid-cols-2 gap-4">

                                            {/* Sell Price */}

                                            <div>

                                                <label className="text-xs font-semibold">
                                                    Sell Price (₹) *
                                                </label>

                                                <div className="relative mt-2">

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={sellPrice}
                                                        min={buyDate || undefined}
                                                        onChange={(e) => setSellPrice(e.target.value)}
                                                        placeholder="Enter sell price"
                                                        className="w-full h-10 border border-slate-200 rounded-lg px-3 pr-10 text-sm outline-none bg-white focus:border-blue-500"
                                                    />

                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        ₹
                                                    </span>

                                                </div>

                                            </div>

                                            {/* Sell Date */}

                                            <div>

                                                <label className="
                                                    text-xs
                                                    font-semibold
                                                ">
                                                    Sell Date *
                                                </label>

                                                <div className="relative mt-2">

                                                    <LuCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                                    <input
                                                        type="date"
                                                        value={sellDate}
                                                        onChange={(e) => setSellDate(e.target.value)}
                                                        className="w-full h-10 border border-slate-200 rounded-lg pl-9 pr-3 text-sm outline-none bg-white focus:border-blue-500"
                                                    />

                                                </div>

                                            </div>

                                        </div>



                                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">

                                            <LuInfo className="w-4 h-4" />

                                            Sell price and sell date are required
                                            for closed trades.

                                        </div>

                                    </div>

                                )}

                            </>

                        )}

                    </section>



                    <div className="border-t border-slate-100 my-5" />

                    {/* STEP 3 — CLIENT ALLOCATION */}

                    <section>

                        <div className="flex items-start gap-3">

                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                3
                            </div>

                            <div>

                                <h2 className="font-bold text-slate-900">
                                    Select Client(s) & Allocate Quantity
                                </h2>

                                <p className="text-xs text-slate-500 mt-1">
                                    Allocate quantity to clients. You can edit
                                    the quantity or percentage for each client.
                                </p>

                            </div>

                        </div>

                        {section2Complete && (
                        
                            <>

                                {/* Allocation Type */}

                                <div className="grid grid-cols-2 gap-4 mt-4">

                                    {/* ALL CLIENTS — DEFAULT */}

                                    <button
                                        type="button"
                                        onClick={() => setAllocationType("ALL")}
                                        className={`text-left rounded-lg p-3 border ${
                                            allocationType === "ALL"
                                                ? "border-blue-300 bg-blue-50/40"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >

                                        <div className="flex items-start gap-3">

                                            <div
                                                className={`mt-0.5 w-4 h-4 rounded-full ${
                                                    allocationType === "ALL"
                                                        ? "border-4 border-blue-600"
                                                        : "border border-slate-300"
                                                }`}
                                            />

                                            <div>

                                                <p className="text-sm font-semibold">
                                                    Allocate to All Clients
                                                </p>

                                                <p className="text-xs text-slate-500 mt-1">
                                                    Distribute quantity among all active clients
                                                </p>

                                            </div>

                                        </div>

                                    </button>


                                    {/* SPECIFIC CLIENTS */}

                                    <button
                                        type="button"
                                        onClick={() => setAllocationType("SPECIFIC")}
                                        className={`text-left rounded-lg p-3 border ${
                                            allocationType === "SPECIFIC"
                                                ? "border-blue-300 bg-blue-50/40"
                                                : "border-slate-200 bg-white"
                                        }`}
                                    >

                                        <div className="flex items-start gap-3">

                                            <div
                                                className={`mt-0.5 w-4 h-4 rounded-full ${
                                                    allocationType === "SPECIFIC"
                                                        ? "border-4 border-blue-600"
                                                        : "border border-slate-300"
                                                }`}
                                            />

                                            <div>

                                                <p className="text-sm font-semibold">
                                                    Allocate to Specific Clients
                                                </p>

                                                <p className="text-xs text-slate-500 mt-1">
                                                    Choose and allocate quantity to selected clients
                                                </p>

                                            </div>

                                        </div>

                                    </button>

                                </div>
                                
                                {/* CLIENT ALLOCATION */}

                                <div 
                                    ref={clientSearchRef}
                                    className="mt-4 relative w-full min-w-0"
                                >

                                    {/* Client Search */}

                                    <div className="relative">

                                        <LuSearch
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                        />

                                        <input
                                            type="text"
                                            value={clientSearch}
                                            onChange={(e) => {
                                                setClientSearch(e.target.value);

                                                if (allocationType === "SPECIFIC") {
                                                    setIsClientDropdownOpen(true);
                                                }
                                            }}
                                            onFocus={() => {
                                                if (allocationType === "SPECIFIC") {
                                                    setIsClientDropdownOpen(true);
                                                }
                                            }}
                                            placeholder="Search and select clients..."
                                            className="w-full h-10 pl-11 pr-10 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                        {allocationType === "SPECIFIC" && (
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() =>
                                                    setIsClientDropdownOpen(prev => !prev)
                                                }
                                                className="absolute right-0 top-0 h-full w-10 flex items-center justify-center"
                                            >
                                                <LuChevronDown
                                                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                                        isClientDropdownOpen ? "rotate-180" : ""
                                                    }`}
                                                />
                                            </button>
                                        )}

                                    </div>

                                    {allocationType === "SPECIFIC" && isClientDropdownOpen && (
                                        <div
                                            className="absolute left-0 right-0 top-11 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-y-auto"
                                            style={{ maxHeight: "280px" }}
                                        >
                                            {allClients
                                                .filter(client =>
                                                    !selectedClientIds.includes(client.id)
                                                )
                                                .filter(client => {
                                                    const search = clientSearch.trim().toLowerCase();

                                                    if (!search) return true;

                                                    return client.name
                                                        .toLowerCase()
                                                        .includes(search);
                                                })
                                                .sort((a, b) => {
                                                    const search = clientSearch.trim().toLowerCase();

                                                    const aName = a.name.toLowerCase();
                                                    const bName = b.name.toLowerCase();

                                                    // No search → alphabetical
                                                    if (!search) {
                                                        return aName.localeCompare(bName);
                                                    }

                                                    // Search → starts-with matches first
                                                    const aStarts = aName.startsWith(search);
                                                    const bStarts = bName.startsWith(search);

                                                    if (aStarts && !bStarts) return -1;
                                                    if (!aStarts && bStarts) return 1;

                                                    return aName.localeCompare(bName);
                                                })
                                                .map(client => (
                                                    <button
                                                        key={client.id}
                                                        type="button"
                                                        onClick={() => {
                                                            handleSelectSpecificClient(client.id);
                                                            setClientSearch("");
                                                            setIsClientDropdownOpen(false);
                                                        }}
                                                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {client.name}
                                                            </p>

                                                            <p className="text-xs text-slate-400 mt-1">
                                                                Client ID: {client.clientId}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))}

                                            {allClients.filter(client =>
                                                !selectedClientIds.includes(client.id) &&
                                                client.name
                                                    .toLowerCase()
                                                    .includes(clientSearch.trim().toLowerCase())
                                            ).length === 0 && (
                                                <div className="px-4 py-3 text-sm text-slate-400">
                                                    No eligible clients found
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ALL CLIENTS — Information */}

                                    {allocationType === "ALL" && (

                                        <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-md bg-blue-50 border border-blue-200 text-xs text-blue-700">

                                            <LuInfo className="w-4 h-4 shrink-0" />

                                            <span>
                                                All active clients are included in this allocation. You can edit the
                                                allocated quantity for each client.
                                            </span>

                                        </div>

                                    )}


                                    {/* Allocation Statistics */}

                                    <div className="grid grid-cols-3 border border-slate-200 rounded-lg mt-4 p-4">

                                        <div>

                                            <p className="text-xs text-slate-500">
                                                Total Quantity to Allocate
                                            </p>

                                            <p className="font-semibold text-sm mt-1">
                                                {quantity || 0} Shares
                                            </p>

                                        </div>


                                        <div className="border-l border-slate-200 pl-5">

                                            <p className="text-xs text-slate-500">
                                                Allocated Quantity
                                            </p>

                                            <p className="font-semibold text-sm text-green-600 mt-1">
                                                {allocatedQuantity} Shares ({allocatedPercentage.toFixed(0)}%)
                                            </p>

                                        </div>


                                        <div className="border-l border-slate-200 pl-5">

                                            <p className="text-xs text-slate-500">
                                                Unallocated Quantity
                                            </p>

                                            <p
                                                className={`font-semibold text-sm mt-1 ${
                                                    unallocatedQuantity < 0
                                                        ? "text-red-600"
                                                        : unallocatedQuantity === 0
                                                            ? "text-green-600"
                                                            : "text-red-500"
                                                }`}
                                            >
                                                {unallocatedQuantity < 0
                                                    ? `${Math.abs(unallocatedQuantity)} Shares Over`
                                                    : `${unallocatedQuantity} Shares (${unallocatedPercentage.toFixed(0)}%)`
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* Client Table */}

                                    <div className="border border-slate-200 rounded-lg mt-3 overflow-hidden">

                                        {/* Header */}

                                        <div
                                            className={`grid px-4 py-3 bg-slate-50 text-xs font-semibold text-slate-600 ${
                                                allocationType === "ALL"
                                                    ? "grid-cols-[1.5fr_1fr_1fr]"
                                                    : "grid-cols-[1.5fr_1fr_1fr_40px]"
                                            }`}
                                        >

                                            <span>
                                                Client Name
                                            </span>

                                            { allocationType === "SPECIFIC" 
                                            ? (
                                                <span>
                                                    Suggested
                                                </span>
                                            )
                                            : (
                                                <span>
                                                    Max Allocatable
                                                </span>
                                            )
                                            }

                                            <span>
                                                Quantity (Shares)
                                            </span>

                                            {allocationType === "SPECIFIC" && (
                                                <span />
                                            )}

                                        </div>


                                        {/* Clients */}

                                        <div 
                                            style={{
                                                maxHeight: "248px",
                                                overflowY: "scroll",
                                            }}
                                        >
                                            
                                            {clientsForTable.length === 0 ? (

                                                <div
                                                    className="flex flex-col items-center justify-center text-center border-t border-slate-100 gap-2"
                                                    style={{
                                                        paddingTop: "18px",
                                                        paddingBottom: "28px",
                                                    }}
                                                >

                                                    <div className="bg-blue-100 rounded-full p-2">
                                                        <LuUsers className="w-5 h-5 text-blue-700" />
                                                    </div>

                                                    <div className="flex flex-col">

                                                        <p className="text-xs font-bold text-slate-600">

                                                            {allocationType === "SPECIFIC"
                                                                ? "No clients selected"
                                                                : "No clients found"
                                                            }

                                                        </p>

                                                        <p className="text-xs text-slate-400 mt-1">

                                                            {allocationType === "SPECIFIC"
                                                                ? "Search above to select clients"
                                                                : "No client names match your search"
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            ): (

                                                clientsForTable.map((client) => (

                                                    <div
                                                        key={client.id}
                                                        className={`grid items-center px-4 py-3 border-t border-slate-100 ${
                                                        allocationType === "ALL"
                                                            ? "grid-cols-[1.5fr_1fr_1fr]"
                                                            : "grid-cols-[1.5fr_1fr_1fr_40px]"
                                                    }`}
                                                    >

                                                        {/* Client */}

                                                        <div className="flex items-center gap-2">

                                                            <div className="w-8 h-8 rounded-full bg-green-profile flex items-center justify-center text-xs font-semibold text-green-700">

                                                                {client.name
                                                                    .split(" ")
                                                                    .map(n => n[0])
                                                                    .join("")
                                                                }

                                                            </div>


                                                            <div>

                                                                <p className="text-sm font-semibold">
                                                                    {client.name}
                                                                </p>

                                                                <p className="text-[10px] text-slate-400">
                                                                    Client ID: {client.clientId}
                                                                </p>

                                                            </div>

                                                        </div>


                                                        {/* Suggested — SPECIFIC ONLY */}

                                                        {allocationType === "SPECIFIC"
                                                        ? 
                                                        (

                                                            <div className="text-sm text-gray-700">
                                                                {client.suggestedQuantity || 0}
                                                            </div>

                                                        )
                                                        :
                                                        (

                                                            <div className="text-sm text-gray-700">
                                                                {client.maxAllocatable || 0}
                                                            </div>

                                                        )
                                                        }


                                                        {/* Quantity */}

                                                        <div>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={client.maxAllocatable}
                                                                value={client.allocatedQuantity ?? 0}
                                                                onChange={(e) => {
                                                                    if (allocationType === "ALL") {
                                                                        handleAllClientQuantityChange(
                                                                            client.id,
                                                                            e.target.value
                                                                        );
                                                                    } else {
                                                                        handleSpecificClientQuantityChange(
                                                                            client.id,
                                                                            e.target.value
                                                                        );
                                                                    }
                                                                }}
                                                                className="w-32 h-9 border border-slate-200 rounded-md px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                            />
                                                        </div>


                                                        {/* Delete — SPECIFIC ONLY */}

                                                        {allocationType === "SPECIFIC" && (

                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveSpecificClient(client.id)}
                                                                className="text-red-500"
                                                            >
                                                                <LuTrash2 className="w-4 h-4" />
                                                            </button>

                                                        )}

                                                    </div>

                                            ))
                                        )}

                                        </div>

                                    </div>


                                    {/* Allocation Message */}

                                    {(
                                        allocationType === "ALL"
                                            ? allClients.length > 0
                                            : selectedClients.length > 0 && allocatedQuantity === totalQuantity
                                    ) && (
                                        <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-md bg-green-50 border border-green-200 text-xs text-green-700 font-medium">

                                            <LuCheck className="w-4 h-4" />

                                            {allocationType === "ALL"
                                                ? "All active clients are included in this allocation."
                                                : "Allocation complete! Total allocated quantity matches the total quantity."
                                            }

                                        </div>
                                    )}

                                </div>

                            </>

                        )}

                    </section>

                    {/* ACTIONS */}

                    <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">

                        < Cancel 
                            onClick={handleCancel}
                        />

                        < AddHoldingButton />

                    </div>

                </div>

                {/* RIGHT SIDE — SUMMARY */}

                <div className="flex flex-col gap-5">

                    {/* HOLDING SUMMARY */}

                    <div className="bg-white border border-slate-200 rounded-xl p-5">

                        <h2 className="font-bold text-slate-900">
                            Holding Summary
                        </h2>

                        <p className="text-xs text-slate-500 mt-1">
                            Review the details before adding
                        </p>

                        {/* Stock */}

                        {selectedCompany && (

                            <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg mt-4">

                                {selectedCompany.logo_url ? (

                                    <img
                                        src={selectedCompany.logo_url}
                                        alt=""
                                        className="w-12 h-12 rounded-full object-contain border border-slate-100"
                                    />

                                ) : (

                                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                        {selectedCompany.ticker?.slice(0, 4)}
                                    </div>

                                )}


                                <div>

                                    <h3 className="font-semibold text-sm">
                                        {selectedCompany.company_name}
                                    </h3>

                                    <p className="text-xs text-slate-500 mt-1">
                                        {selectedCompany.ticker}

                                        <span className="mx-2">•</span>

                                        {selectedCompany.exchange}
                                    </p>

                                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold">
                                        {selectedCompany.industry || selectedCompany.sector}
                                    </span>

                                </div>

                            </div>

                        )}


                        {/* Summary Rows */}

                        <div className="mt-3">

                            {[
                                [
                                    "Current Market Price",
                                    selectedCompany
                                        ? `₹ ${Number(selectedCompany.current_price).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : "—"
                                ],

                                [
                                    "Buy Price",
                                    buyPrice
                                        ? `₹ ${Number(buyPrice).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : "—"
                                ],

                                [
                                    "Quantity",
                                    quantity
                                        ? `${quantity} Shares`
                                        : "—"
                                ],

                                [
                                    "Invested Amount",
                                    quantity && buyPrice
                                        ? `₹ ${(Number(quantity) * Number(buyPrice)).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : "—"
                                ],

                                [
                                    "Trade Status",
                                    tradeStatus === "OPEN"
                                        ? "Open"
                                        : "Closed"
                                ],

                                [
                                    "Buy Date",
                                    buyDate
                                        ? new Date(buyDate).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })
                                        : "—"
                                ],

                                [
                                    "Sell Price",
                                    tradeStatus === "CLOSED" && sellPrice
                                        ? `₹ ${Number(sellPrice).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}`
                                        : "—"
                                ],

                                [
                                    "Sell Date",
                                    tradeStatus === "CLOSED" && sellDate
                                        ? new Date(sellDate).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })
                                        : "—"
                                ],

                                [
                                    "Profit / Loss",

                                    quantity && buyPrice && selectedCompany
                                        ? tradeStatus === "OPEN"
                                            ? `₹ ${(
                                                Number(quantity) *
                                                (
                                                    Number(selectedCompany.current_price) -
                                                    Number(buyPrice)
                                                )
                                            ).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}`
                                            : sellPrice
                                                ? `₹ ${(
                                                    Number(quantity) *
                                                    (
                                                        Number(sellPrice) -
                                                        Number(buyPrice)
                                                    )
                                                ).toLocaleString("en-IN", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}`
                                                : "—"
                                        : "—"
                                ]

                            ].map(([label, value]) => (

                                <div
                                    key={label}
                                    className="flex items-center justify-between py-3 border-b border-slate-100 text-sm"
                                >

                                    <span className="text-slate-600">
                                        {label}
                                    </span>


                                    <span
                                        className={`font-semibold ${
                                            label === "Trade Status"
                                                ? tradeStatus === "OPEN"
                                                    ? "text-green-600"
                                                    : "text-slate-600"

                                                : label === "Profit / Loss" && value !== "—"
                                                    ? Number(
                                                        value
                                                            .replace("₹", "")
                                                            .replace(/,/g, "")
                                                    ) >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"

                                                : "text-slate-900"
                                        }`}
                                    >
                                        {value}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* CLIENT ALLOCATION SUMMARY */}

                    {section2Complete && (
                        
                        <>

                            <div className="bg-white border border-slate-200 rounded-xl p-5">

                                <div className="flex items-center justify-between">

                                    <h2 className="font-bold">
                                        Client Allocation Summary
                                    </h2>

                                    <span className="text-xs font-semibold text-slate-500">
                                        {clientsForAllocation.length} Clients
                                    </span>

                                </div>

                                {/* DONUT */}

                                <div className="flex items-center justify-center py-6">

                                    <div className="relative w-[180px] h-[180px]">

                                        <PieChart width={180} height={180}>

                                            <Pie
                                                data={clientAllocationData}
                                                dataKey="allocatedQuantity"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={58}
                                                outerRadius={82}
                                                paddingAngle={2}
                                                stroke="none"
                                            >

                                                {clientAllocationData.map((_, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={[
                                                            "#2563eb",
                                                            "#10b981",
                                                            "#8b5cf6",
                                                            "#f59e0b",
                                                            "#ef4444",
                                                            "#06b6d4"
                                                        ][index % 6]}
                                                    />
                                                ))}

                                            </Pie>

                                        </PieChart>


                                        {/* CENTER */}

                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

                                            <span className="text-2xl font-bold text-slate-900">
                                                {allocatedQuantity}
                                            </span>

                                            <span className="text-[10px] text-slate-500">
                                                Shares
                                            </span>

                                            <span className="text-[9px] text-emerald-600 font-medium">
                                                {allocatedPercentage.toFixed(0)}% Allocated
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* CLIENT LIST */}

                                <div className="max-h-48 overflow-y-auto pr-2 space-y-3">

                                    {clientAllocationData.map((client, index) => {

                                        const percentage =
                                            allocatedQuantity > 0
                                                ? (client.allocatedQuantity / allocatedQuantity) * 100
                                                : 0;

                                        const clientColor = [
                                            "#2563eb",
                                            "#10b981",
                                            "#8b5cf6",
                                            "#f59e0b",
                                            "#ef4444",
                                            "#06b6d4"
                                        ][index % 6];

                                        return (
                                            <div
                                                key={client.name}
                                                className="flex items-center gap-3"
                                            >

                                                <span
                                                    className="w-3 h-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: clientColor }}
                                                />

                                                <div className="min-w-0">

                                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                                        {client.name}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {client.allocatedQuantity} Shares
                                                        {" "}
                                                        ({percentage.toFixed(1)}%)
                                                    </p>

                                                </div>

                                            </div>
                                        );

                                    })}

                                </div>

                                <p className="text-xs text-slate-400 mt-5">
                                    Allocation can be edited before adding this holding.
                                </p>

                            </div>

                            {/* INFORMATION */}

                            <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-700">

                                <LuInfo className="w-4 h-4 shrink-0" />

                                This holding will be added to the selected client(s)
                                portfolio and reflected in their dashboard.

                            </div>

                        </>

                    )}

                </div>

            </div>

            {showCancelModal && 
            (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

                    <div className="w-[420px] bg-white rounded-xl shadow-xl border border-slate-200 p-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Discard this trade?
                        </h2>

                        <p className="text-sm text-slate-500 mt-2 leading-6">
                            All entered trade details and client allocations will be lost.
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                type="button"
                                onClick={() => setShowCancelModal(false)}
                                className="px-5 h-10 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Keep Editing
                            </button>

                            <button
                                type="button"
                                onClick={confirmCancel}
                                className="px-5 h-10 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                            >
                                Discard Trade
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* ================= ADD COMPANY MODAL ================= */}

                {showAddCompanyModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">

                        <div className="w-full max-w-[1100px] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">

                            {/* HEADER */}
                            <div className="h-[88px] px-6 flex items-center justify-between border-b border-slate-100">

                                {/* Title */}
                                <div className="flex items-center gap-3">

                                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <LuBuilding2 className="w-7 h-7 text-blue-600" />
                                    </div>

                                    <div>
                                        <h2 className="text-base font-bold text-slate-900">
                                            Add New Company
                                        </h2>

                                        <p className="text-sm text-slate-500 mt-1">
                                            Add a new stock to your platform
                                        </p>
                                    </div>

                                </div>


                                {/* Steps + Close */}
                                <div className="flex items-center gap-6">

                                    <div className="flex items-center gap-2">

                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-semibold text-xs ${
                                            isStep2 || isStep3
                                                ? "bg-green-500 text-white"
                                                : isStep1
                                                    ? "bg-blue-600 text-white"
                                                    : "border border-slate-300 text-slate-400"
                                        }`}>
                                            {isStep2 || isStep3 ? "✓" : "1"}
                                        </div>

                                        <span className={`text-sm ${
                                            isStep2 || isStep3
                                                ? "text-green-600 font-medium"
                                                : isStep1
                                                    ? "text-blue-600 font-medium"
                                                    : "text-slate-400"
                                        }`}>
                                            Enter Ticker
                                        </span>

                                    </div>


                                    <div className="h-px w-8 bg-slate-200" />


                                    <div className="flex items-center gap-2 text-sm">

                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-semibold text-xs ${
                                            isStep3
                                                ? "bg-green-500 text-white"
                                                : addCompanyStep === "not-found"
                                                    ? "bg-red-500 text-white"
                                                    : isStep2
                                                        ? "bg-blue-600 text-white"
                                                        : "border border-slate-300 text-slate-400"
                                        }`}>
                                            {isStep3
                                                ? "✓"
                                                : addCompanyStep === "not-found"
                                                    ? "✕"
                                                    : "2"
                                            }
                                        </div>

                                        <span className={`text-sm ${
                                            addCompanyStep === "not-found"
                                                ? "text-red-500 font-medium"
                                                : isStep3
                                                    ? "text-green-600 font-medium"
                                                    : isStep2
                                                        ? "text-blue-600 font-medium"
                                                        : "text-slate-400"
                                        }`}>
                                            Fetch Details
                                        </span>

                                    </div>


                                    <div className="h-px w-8 bg-slate-200" />


                                    <div className="flex items-center gap-2 text-sm">

                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center font-semibold ${
                                                companyAdded
                                                    ? "bg-green-500 text-white"
                                                    : companyAddFailed
                                                        ? "bg-red-500 text-white"
                                                        : isStep3
                                                            ? "bg-blue-600 text-white"
                                                            : "border border-slate-300 text-slate-400"
                                            }`}
                                        >
                                            {companyAdded
                                                ? "✓"
                                                : companyAddFailed
                                                    ? "✕"
                                                    : "3"
                                            }
                                        </div>

                                        <span
                                            className={`text-sm ${
                                                companyAdded
                                                    ? "text-green-600 font-medium"
                                                    : companyAddFailed
                                                        ? "text-red-500 font-medium"
                                                        : isStep3
                                                            ? "text-blue-600 font-medium"
                                                            : "text-slate-400"
                                            }`}
                                        >
                                            Confirm
                                        </span>

                                    </div>

                                </div>


                                {/* Close */}
                                <button
                                    type="button"
                                    onClick={closeAddCompanyModal}
                                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                >
                                    <LuX className="w-6 h-6" />
                                </button>

                            </div>


                            {/* BODY */}

                            <div className="h-[512px] grid grid-cols-[40%_60%]">

                                {addCompanyStep === "ticker" && (
                                    <>
                                        
                                        

                                            {/* LEFT PANEL */}
                                            <div className="bg-blue-100/40 border-r border-slate-100 px-10 py-7 flex items-center">

                                                <div className="w-full max-w-[300px] mx-auto">

                                                    {/* Illustration */}
                                                    <div className="flex justify-center mb-7">

                                                        <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <LuBuilding2 className="w-14 h-14 text-blue-600" />
                                                        </div>

                                                    </div>


                                                    {/* Heading */}
                                                    <h3 className="text-xl font-bold leading-6 text-slate-900">
                                                        Search for an NSE or BSE
                                                        <br />
                                                        listed company
                                                    </h3>


                                                    {/* Description */}
                                                    <p className="text-sm text-slate-600 leading-5 mt-4">
                                                        Enter the exact stock ticker to fetch
                                                        company details directly from Financial
                                                        Modeling Prep (FMP).
                                                    </p>


                                                    {/* Features */}
                                                    <div className="mt-7 space-y-4">

                                                        <div className="flex items-center gap-3">
                                                            <LuBadgeCheck className="w-4 h-4 text-blue-600 shrink-0 " />

                                                            <span className="text-sm text-slate-600">
                                                                NSE & BSE listed stocks
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <LuRefreshCw className="w-4 h-4 text-blue-600 shrink-0" />

                                                            <span className="text-sm text-slate-600">
                                                                Auto-fetch company details
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <LuShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />

                                                            <span className="text-sm text-slate-600">
                                                                Quick and secure
                                                            </span>
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* RIGHT PANEL */}
                                            <div className="bg-white">
                                                {/* RIGHT PANEL */}
                                                    <div className="bg-white px-20 py-16 flex flex-col justify-center">

                                                        <div className="flex flex-col w-full max-w-[520px] gap-10">

                                                            <div>
                                                                {/* Label */}
                                                                <label className="block text-sm font-semibold text-slate-800 mb-2">
                                                                    Ticker Symbol
                                                                    <span className="text-red-500 ml-1">*</span>
                                                                </label>


                                                                {/* Input */}
                                                                <div className="relative">

                                                                    <input
                                                                        type="text"
                                                                        value={newCompanyTicker}
                                                                        onChange={(e) => setNewCompanyTicker(e.target.value.toUpperCase())}
                                                                        placeholder="e.g. TCS"
                                                                        className=" w-full h-12 px-4 pr-10 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 "
                                                                    />

                                                                    {newCompanyTicker && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setNewCompanyTicker("")}
                                                                            className="
                                                                                absolute right-3 top-6
                                                                                -translate-y-1/2
                                                                                text-slate-400
                                                                                hover:text-slate-600
                                                                            "
                                                                        >
                                                                            <LuX className="w-4 h-4" />
                                                                        </button>
                                                                    )}

                                                                    {/* Helper text */}
                                                                    <p className="mt-4 text-sm text-slate-400 leading-5">
                                                                        Use the exact ticker symbol (e.g. TCS, RELIANCE, INFY).  We'll fetch the latest company details from NSE or BSE.
                                                                    </p>

                                                                </div>
                                                            </div>

                                                            {/* Information box */}
                                                            <div className=" rounded-lg border border-blue-100 bg-blue-50/70 px-4 py-3 flex items-center gap-4">

                                                                <LuInfo className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />

                                                                <div>
                                                                    <p className="text-sm text-blue-600 leading-5">
                                                                        Make sure the ticker is correct to get accurate results.
                                                                    </p>

                                                                    <p className="text-sm text-slate-600 leading-5">
                                                                        We search on NSE/BSE via Financial Modeling Prep (FMP).
                                                                    </p>
                                                                </div>

                                                            </div>


                                                            {/* Button */}
                                                            <div className="flex justify-end mt-4">

                                                                <button
                                                                    type="button"
                                                                    onClick={handleFetchCompanyDetails}
                                                                    disabled={!newCompanyTicker.trim()}
                                                                    className="
                                                                        h-11
                                                                        px-6
                                                                        rounded-lg
                                                                        bg-blue-600
                                                                        text-white
                                                                        text-sm
                                                                        font-semibold
                                                                        flex items-center gap-2
                                                                        transition
                                                                        hover:bg-blue-700
                                                                        disabled:opacity-50
                                                                        disabled:cursor-not-allowed
                                                                    "
                                                                >
                                                                    Fetch Details

                                                                    <LuArrowRight className="w-4 h-4" />

                                                                </button>

                                                            </div>

                                                        </div>

                                                    </div>

                                            </div>

                                        
                                    </>
                                )}

                                {addCompanyStep === "fetching" && (
                                    <>
                                        {/* LEFT PANEL */}

                                        <div className="bg-blue-100/40 border-r border-slate-100 px-10 py-8 flex items-center">

                                            <div className="w-full max-w-[330px] mx-auto">

                                                {/* ILLUSTRATION AREA */}
                                                <div className="h-48 flex items-center justify-center mb-5">

                                                    <div className="relative">

                                                        {/* Main illustration placeholder */}
                                                        <div className="w-32 h-32 rounded-3xl bg-blue-100 flex items-center justify-center">
                                                            <LuBuilding2 className="w-16 h-16 text-blue-600" />
                                                        </div>


                                                        {/* FMP BADGE */}
                                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-white border border-blue-100 shadow-sm">
                                                            <span className="text-sm font-bold text-blue-600">
                                                                FMP
                                                            </span>
                                                        </div>


                                                        {/* NSE BADGE */}
                                                        <div className="absolute bottom-2 -left-14 px-4 py-2 rounded-xl bg-white border border-emerald-100 shadow-sm">
                                                            <span className="text-sm font-bold text-emerald-600">
                                                                • NSE
                                                            </span>
                                                        </div>


                                                        {/* BSE BADGE */}
                                                        <div className="absolute bottom-2 -right-14 px-4 py-2 rounded-xl bg-white border border-blue-100 shadow-sm">
                                                            <span className="text-sm font-bold text-blue-600">
                                                                • BSE
                                                            </span>
                                                        </div>

                                                    </div>

                                                </div>


                                                {/* HEADING */}
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    Fetching company details
                                                </h3>


                                                {/* DESCRIPTION */}
                                                <p className="text-sm text-slate-600 leading-5 mt-3">
                                                    We're getting the latest company information
                                                    from Financial Modeling Prep (FMP).
                                                </p>

                                                <p className="text-sm text-slate-400 mt-1">
                                                    This may take a few seconds.
                                                </p>


                                                {/* FETCHING PROGRESS */}

                                                <div className="mt-8 space-y-4">


                                                    {/* SEARCHING */}
                                                    <div className="flex items-center gap-3">

                                                        <div
                                                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                                                fetchingStage > 0
                                                                    ? "bg-blue-600"
                                                                    : "border-2 border-blue-600"
                                                            }`}
                                                        >
                                                            {fetchingStage > 0 ? (
                                                                <LuCheck className="w-3 h-3 text-white" />
                                                            ) : (
                                                                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                            )}
                                                        </div>

                                                        <span
                                                            className={`text-sm ${
                                                                fetchingStage >= 0
                                                                    ? "text-slate-700 font-medium"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            Searching on NSE and BSE
                                                        </span>

                                                    </div>


                                                    {/* COMPANY PROFILE */}
                                                    <div className="flex items-center gap-3">

                                                        <div
                                                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                                                fetchingStage > 1
                                                                    ? "bg-blue-600"
                                                                    : fetchingStage === 1
                                                                        ? "border-2 border-blue-600"
                                                                        : "border border-slate-300"
                                                            }`}
                                                        >
                                                            {fetchingStage > 1 ? (
                                                                <LuCheck className="w-3 h-3 text-white" />
                                                            ) : fetchingStage === 1 ? (
                                                                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                            ) : null}
                                                        </div>

                                                        <span
                                                            className={`text-sm ${
                                                                fetchingStage >= 1
                                                                    ? "text-slate-700 font-medium"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            Fetching company profile
                                                        </span>

                                                    </div>


                                                    {/* MARKET DATA */}
                                                    <div className="flex items-center gap-3">

                                                        <div
                                                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                                                fetchingStage === 2
                                                                    ? "border-2 border-blue-600"
                                                                    : "border border-slate-300"
                                                            }`}
                                                        >
                                                            {fetchingStage === 2 && (
                                                                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                            )}
                                                        </div>

                                                        <span
                                                            className={`text-sm ${
                                                                fetchingStage === 2
                                                                    ? "text-slate-700 font-medium"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            Retrieving latest market data
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>


                                        {/* RIGHT PANEL */}

                                        <div className="bg-white px-14 py-10 flex items-center justify-center">

                                            <div className="w-full max-w-[520px]">


                                                {/* LOADING CONTENT */}

                                                <div className="text-center">


                                                    {/* CIRCULAR PROGRESS */}
                                                    <div className="relative mx-auto w-32 h-32 mb-8">

                                                        <svg
                                                            className="w-32 h-32 -rotate-90"
                                                            viewBox="0 0 100 100"
                                                        >

                                                            {/* Background ring */}
                                                            <circle
                                                                cx="50"
                                                                cy="50"
                                                                r="40"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="8"
                                                                className="text-blue-100"
                                                            />


                                                            {/* Progress ring */}
                                                            <circle
                                                                cx="50"
                                                                cy="50"
                                                                r="40"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="8"
                                                                strokeLinecap="round"
                                                                strokeDasharray="251"
                                                                strokeDashoffset={
                                                                    fetchingStage === 0
                                                                        ? "188"
                                                                        : fetchingStage === 1
                                                                            ? "125"
                                                                            : "63"
                                                                }
                                                                className="text-blue-600 transition-all duration-700 ease-out"
                                                            />

                                                        </svg>


                                                        {/* Percentage */}
                                                        <div className="absolute inset-0 flex items-center justify-center">

                                                            <span className="text-lg font-bold text-blue-600">
                                                                {fetchingStage === 0
                                                                    ? "25%"
                                                                    : fetchingStage === 1
                                                                        ? "50%"
                                                                        : "75%"
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>


                                                    {/* MAIN STATUS */}
                                                    <h3 className="text-xl font-bold text-slate-900">
                                                        Searching for "{newCompanyTicker}"...
                                                    </h3>


                                                    <p className="text-sm text-slate-500 mt-2">
                                                        Please wait while we fetch the company details.
                                                    </p>

                                                </div>


                                                {/* INFORMATION CARD */}

                                                <div className="mt-12 rounded-xl border border-blue-100 bg-blue-50/50 px-5 py-4 flex items-center gap-4">

                                                    {/* Icon */}
                                                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                                                        <LuInfo className="w-6 h-6 text-blue-600" />
                                                    </div>


                                                    {/* Message */}
                                                    <div>

                                                        <p className="text-sm text-slate-600 leading-relaxed">

                                                            <span className="font-semibold text-slate-800">
                                                                Hang tight!
                                                            </span>{" "}

                                                            We're using live data from Financial Modeling Prep.

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    </>
                                )}

                                {addCompanyStep === "found" && (
                                    <>
                                        {/* LEFT PANEL */}
                                        <div className="bg-blue-100/40 border-r border-slate-100 px-10 py-3 flex items-center">

                                            <div className="w-full max-w-[300px] mx-auto">

                                                <div className="flex justify-center mb-7">
                                                    {fetchedCompany?.logo_url ? (
                                                        <img
                                                            src={fetchedCompany.logo_url}
                                                            alt=""
                                                            className="w-28 h-28 rounded-full object-contain bg-white border border-slate-200"
                                                        />
                                                    ) : (
                                                        <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <LuBuilding2 className="w-12 h-12 text-blue-600" />
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="text-xl font-bold text-slate-900">
                                                    Company found !
                                                </h3>

                                                <p className="text-sm text-slate-600 leading-5 mt-3">
                                                    Review the details below and confirm to add this company to your stock list.
                                                </p>

                                                {/* Features */}
                                                    <div className="mt-7 space-y-4">

                                                        <div className="flex items-center gap-3">
                                                            <LuBadgeCheck className="w-4 h-4 text-blue-600 shrink-0 " />

                                                            <span className="text-sm text-slate-600">
                                                                Veritied NSE BSE listing
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <LuClipboardList className="w-4 h-4 text-blue-600 shrink-0" />

                                                            <span className="text-sm text-slate-600">
                                                                Complete company profile
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <LuLayers2 className="w-4 h-4 text-blue-600 shrink-0" />

                                                            <span className="text-sm text-slate-600">
                                                                Ready to add to your platform
                                                            </span>
                                                        </div>

                                                    </div>

                                            </div>
                                        </div>

                                        {/* RIGHT PANEL */}
                                        <div className="bg-white px-16 py-5 flex flex-col justify-center">

                                            <div className="w-full max-w-[520px]">

                                                {/* COMPANY HEADER */}
                                                <div className="flex items-center gap-4">

                                                    {/* Logo */}
                                                    {fetchedCompany?.logo_url ? (
                                                        <div className="w-24 h-24 rounded-lg border border-slate-200 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                                                            <img
                                                                src={fetchedCompany.logo_url}
                                                                alt=""
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-24 h-24 rounded-lg border border-slate-200 bg-blue-50 flex items-center justify-center shrink-0">
                                                            <LuBuilding2 className="w-10 h-10 text-blue-600" />
                                                        </div>
                                                    )}

                                                    {/* Company Identity */}
                                                    <div className="min-w-0">

                                                        <h3 className="text-xl font-bold text-slate-900">
                                                            {fetchedCompany?.company_name || "—"}
                                                        </h3>

                                                        <div className="flex items-center gap-2 mt-3">

                                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                                                                {fetchedCompany?.ticker || "—"}
                                                            </span>

                                                            <span className="text-slate-300">
                                                                |
                                                            </span>

                                                            <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                                                                {fetchedCompany?.exchange || "—"}
                                                            </span>

                                                            <span className="text-slate-300">
                                                                |
                                                            </span>

                                                            <span className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-sm font-semibold text-green-600">
                                                                Equity
                                                            </span>

                                                        </div>

                                                        <p className="text-sm text-slate-500 mt-2">
                                                            {fetchedCompany?.industry || fetchedCompany?.sector || "—"}
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* DIVIDER */}
                                                <div className="border-t border-slate-100 mt-7" />


                                                {/* COMPANY INFORMATION */}
                                                <div className="grid grid-cols-2 mt-1">

                                                    {/* LEFT COLUMN */}
                                                    <div className="pr-6 border-r border-slate-100">

                                                        <div className="flex items-center justify-between py-3">
                                                            <span className="text-sm text-slate-500">
                                                                Full Name
                                                            </span>

                                                            <span className="text-sm font-semibold text-slate-900 text-right ml-4">
                                                                {fetchedCompany?.company_name || "—"}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between py-3">
                                                            <span className="text-sm text-slate-500">
                                                                Ticker
                                                            </span>

                                                            <span className="text-sm font-semibold text-slate-900">
                                                                {fetchedCompany?.ticker || "—"}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between py-3">
                                                            <span className="text-sm text-slate-500">
                                                                Exchange
                                                            </span>

                                                            <span className="text-sm font-semibold text-slate-900">
                                                                {fetchedCompany?.exchange || "—"}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between py-3">
                                                            <span className="text-sm text-slate-500">
                                                                ISIN
                                                            </span>

                                                            <span className="text-sm font-semibold text-slate-900">
                                                                {fetchedCompany?.isin || "—"}
                                                            </span>
                                                        </div>

                                                    </div>


                                                    {/* RIGHT COLUMN */}
                                                    <div className="pl-6">

                                                        <div className="flex items-center justify-between py-3">
                                                            <span className="text-sm text-slate-500">
                                                                Current Price
                                                            </span>

                                                            <span className="text-sm font-semibold text-slate-900">
                                                                ₹ {Number(
                                                                    fetchedCompany?.current_price || 0
                                                                ).toLocaleString("en-IN", {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                })}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between py-3">
                                                            <span className="text-sm text-slate-500">
                                                                Sector
                                                            </span>

                                                            <span className="text-sm font-semibold text-slate-900 text-right ml-4">
                                                                {fetchedCompany?.sector || "—"}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between py-3">
                                                            <span className="text-sm text-slate-500">
                                                                Industry
                                                            </span>

                                                            <span className="text-sm font-semibold text-slate-900 text-right ml-4 max-w-[190px]">
                                                                {fetchedCompany?.industry || "—"}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between py-3">
                                                            <span className="text-sm text-slate-500">
                                                                Website
                                                            </span>

                                                            {fetchedCompany?.website ? (
                                                                <a
                                                                    href={fetchedCompany.website}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 truncate ml-4"
                                                                >
                                                                    {fetchedCompany.website}
                                                                </a>
                                                            ) : (
                                                                <span className="text-sm font-semibold text-slate-900">
                                                                    —
                                                                </span>
                                                            )}

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* CONFIRMATION MESSAGE */}
                                                <div className="mt-5 px-4 py-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">

                                                    <LuCircleCheckBig className="w-5 h-5 text-green-600 shrink-0" />

                                                    <p className="text-sm text-green-700">
                                                        This company will be added to your stock list and can be
                                                        used for future trades.
                                                    </p>

                                                </div>


                                                {/* ACTIONS */}
                                                <div className="flex justify-end gap-3 mt-4">

                                                    <button
                                                        type="button"
                                                        onClick={handleTryAgain}
                                                        className="h-11 px-7 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={handleAddCompany}
                                                        className="h-11 px-7 rounded-lg bg-blue-600 text-white text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
                                                    >
                                                        Add Company
                                                    </button>

                                                </div>

                                            </div>

                                        </div>
                                    </>
                                )}

                                {addCompanyStep === "not-found" && (
                                    <>
                                        {/* LEFT PANEL */}
                                        <div className="bg-red-100/40 border-r border-slate-100 px-10 flex items-center">

                                            <div className="w-full max-w-[300px] mx-auto">

                                                {/* Illustration */}
                                                <div className="flex justify-center mb-8">

                                                    <div className="w-32 h-32 rounded-full bg-red-100 flex items-center justify-center">
                                                        <LuCircleAlert className="w-16 h-16 text-red-500" />
                                                    </div>

                                                </div>


                                                {/* Heading */}
                                                <h3 className="text-xl font-bold leading-6 text-slate-900">
                                                    Company not found
                                                </h3>


                                                {/* Description */}
                                                <p className="text-sm text-slate-600 leading-5 mt-4">
                                                    We couldn't find a company matching the ticker
                                                    you entered. Please check the ticker and try again.
                                                </p>


                                                {/* Features / Suggestions */}
                                                <div className="mt-7 space-y-4">

                                                    <div className="flex items-center gap-3">

                                                        <LuBadgeCheck className="w-4 h-4 text-red-500 shrink-0" />

                                                        <span className="text-sm text-slate-600">
                                                            Check the ticker spelling
                                                        </span>

                                                    </div>


                                                    <div className="flex items-center gap-3">

                                                        <LuSearch className="w-4 h-4 text-red-500 shrink-0" />

                                                        <span className="text-sm text-slate-600">
                                                            Use an NSE or BSE ticker
                                                        </span>

                                                    </div>


                                                    <div className="flex items-center gap-3">

                                                        <LuRefreshCw className="w-4 h-4 text-red-500 shrink-0" />

                                                        <span className="text-sm text-slate-600">
                                                            Try searching again
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>


                                        {/* RIGHT PANEL */}
                                        <div className="bg-white px-20 py-16 flex items-center justify-center">

                                            <div className="w-full max-w-[520px]">

                                                {/* Error Banner */}
                                                <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 flex items-center gap-5">

                                                    <TbAlertOctagonFilled className="w-10 h-10 text-red-500 shrink-0" />

                                                    <div>

                                                        <p className="text-sm font-semibold text-red-600">
                                                            No company found
                                                        </p>

                                                        <p className="text-sm text-red-600/80 mt-1">
                                                            We couldn't find any listed company for this ticker.
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Search Card */}
                                                <div className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-5">

                                                    <div className="flex items-center gap-4">

                                                        {/* Icon */}
                                                        <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">

                                                            <LuSearch className="w-6 h-6 text-red-500" />

                                                        </div>


                                                        {/* Search Details */}
                                                        <div className="min-w-0">

                                                            <p className="text-sm text-slate-500">
                                                                Ticker searched
                                                            </p>

                                                            <p className="text-base font-semibold text-slate-900 mt-1">
                                                                {newCompanyTicker || "—"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* Helper Message */}
                                                <div className="mt-5 px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">

                                                    <LuInfo className="w-5 h-5 text-slate-500 shrink-0" />

                                                    <p className="text-sm text-slate-600 leading-5">
                                                        Make sure you're using the exact NSE or BSE
                                                        ticker symbol, such as TCS, INFY or RELIANCE.
                                                    </p>

                                                </div>


                                                {/* Actions */}
                                                <div className="flex justify-end items-center gap-3 mt-8">

                                                    <button
                                                        type="button"
                                                        onClick={closeAddCompanyModal}
                                                        className="
                                                            h-11
                                                            px-6
                                                            rounded-lg
                                                            border
                                                            border-slate-200
                                                            bg-white
                                                            text-slate-700
                                                            text-sm
                                                            font-semibold
                                                            transition
                                                            hover:bg-slate-50
                                                        "
                                                    >
                                                        Cancel
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={handleTryAgain}
                                                        className="
                                                            h-11
                                                            px-6
                                                            rounded-lg
                                                            bg-blue-600
                                                            text-white
                                                            text-sm
                                                            font-semibold
                                                            flex
                                                            items-center
                                                            gap-2
                                                            transition
                                                            hover:bg-blue-700
                                                        "
                                                    >
                                                        <LuRefreshCw className="w-4 h-4" />
                                                        Try Again
                                                    </button>

                                                </div>

                                            </div>

                                        </div>
                                    </>
                                )}

                                {addCompanyStep === "added" && (
                                <>
                                    {/* LEFT PANEL */}
                                    <div className="bg-green-50/60 border-r border-slate-100 px-10 py-7 flex items-center">
                                        <div className="w-full max-w-[300px] mx-auto">

                                            {/* Illustration placeholder */}
                                            <div className="flex justify-center mb-8">
                                                <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center">
                                                    <LuBadgeCheck className="w-16 h-16 text-green-600" />
                                                </div>
                                            </div>

                                            {/* Heading */}
                                            <h3 className="text-xl font-bold leading-6 text-slate-900">
                                                Company added successfully!
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-slate-600 leading-5 mt-4">
                                                The company has been successfully added to your stock
                                                list and is now available across the platform.
                                            </p>

                                        </div>
                                    </div>


                                    {/* RIGHT PANEL */}
                                    <div className="bg-white px-20 py-16 flex items-center justify-center">
                                        <div className="w-full max-w-[520px]">

                                            {/* Success Banner */}
                                            <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-4 flex items-center gap-5">

                                                <HiCheckCircle className="w-10 h-10 text-green-600"/>

                                                <div>
                                                    <p className="text-sm font-semibold text-green-700">
                                                        Company successfully added
                                                    </p>

                                                    <p className="text-sm text-green-700/80 mt-1">
                                                        {fetchedCompany?.ticker || newCompanyTicker} is now
                                                        available in your platform.
                                                    </p>
                                                </div>

                                            </div>


                                            {/* Company Card */}
                                            <div className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-5">

                                                <div className="flex items-center gap-4">

                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                        <LuBuilding2 className="w-6 h-6 text-slate-500" />
                                                    </div>

                                                    <div>
                                                        <p className="text-base font-semibold text-slate-900">
                                                            {fetchedCompany?.company_name || "Company"}
                                                        </p>

                                                        <div className="flex items-center gap-2 mt-1">

                                                            <span className="text-sm text-slate-500">
                                                                {fetchedCompany?.ticker || newCompanyTicker}
                                                            </span>

                                                            <span className="text-slate-300">
                                                                •
                                                            </span>

                                                            <span className="text-sm text-slate-500">
                                                                Added to stock list
                                                            </span>

                                                        </div>
                                                    </div>

                                                </div>

                                            </div>


                                            {/* Done */}
                                            <div className="flex justify-end mt-8">

                                                <button
                                                    type="button"
                                                    onClick={closeAddCompanyModal}
                                                    className="
                                                        h-11
                                                        px-7
                                                        rounded-lg
                                                        bg-blue-600
                                                        text-white
                                                        text-sm
                                                        font-semibold
                                                        flex
                                                        items-center
                                                        justify-center
                                                        transition
                                                        hover:bg-blue-700
                                                    "
                                                >
                                                    Done
                                                </button>

                                            </div>

                                        </div>
                                    </div>
                                </>
                            )}

                            {addCompanyStep === "add-failed" && (
                            <>
                                {/* LEFT PANEL */}
                                <div className="bg-red-50/60 border-r border-slate-100 px-10 py-7 flex items-center">
                                    <div className="w-full max-w-[300px] mx-auto">

                                        {/* Illustration placeholder */}
                                        <div className="flex justify-center mb-8">
                                            <div className="w-32 h-32 rounded-full bg-red-100 flex items-center justify-center">
                                                <LuFileX2 className="w-16 h-16 text-red-500" />
                                            </div>
                                        </div>

                                        {/* Heading */}
                                        <h3 className="text-xl font-bold leading-6 text-slate-900">
                                            Unable to add company
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-slate-600 leading-5 mt-4">
                                            Something went wrong while adding this company to your
                                            stock list. Please try again.
                                        </p>

                                    </div>
                                </div>


                                {/* RIGHT PANEL */}
                                <div className="bg-white px-20 py-16 flex items-center justify-center">
                                    <div className="w-full max-w-[520px]">

                                        {/* Error Banner */}
                                        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 flex items-center gap-5">

                                            <TbAlertOctagonFilled className="w-10 h-10 text-red-600" />

                                            <div>
                                                <p className="text-sm font-semibold text-red-600">
                                                    We couldn't add{" "}
                                                    {fetchedCompany?.ticker || newCompanyTicker}
                                                </p>

                                                <p className="text-sm text-red-600/80 mt-1">
                                                    An unexpected error occurred while saving the
                                                    company. Please try again.
                                                </p>
                                            </div>

                                        </div>


                                        {/* Company Card */}
                                        <div className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-5">

                                            <div className="flex items-center gap-4">

                                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                    <LuBuilding2 className="w-6 h-6 text-slate-500" />
                                                </div>

                                                <div>
                                                    <p className="text-base font-semibold text-slate-900">
                                                        {fetchedCompany?.company_name || "Company"}
                                                    </p>

                                                    <div className="flex items-center gap-2 mt-1">

                                                        <span className="text-sm text-slate-500">
                                                            {fetchedCompany?.ticker || newCompanyTicker}
                                                        </span>

                                                        <span className="text-slate-300">
                                                            •
                                                        </span>

                                                        <span className="text-sm text-slate-500">
                                                            Not added to stock list
                                                        </span>

                                                    </div>
                                                </div>

                                            </div>

                                        </div>


                                        {/* Actions */}
                                        <div className="flex justify-end items-center gap-3 mt-8">

                                            <button
                                                type="button"
                                                onClick={closeAddCompanyModal}
                                                className="
                                                    h-11
                                                    px-6
                                                    rounded-lg
                                                    border
                                                    border-slate-200
                                                    bg-white
                                                    text-slate-700
                                                    text-sm
                                                    font-semibold
                                                    transition
                                                    hover:bg-slate-50
                                                "
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleTryAgain}
                                                className="
                                                    h-11
                                                    px-6
                                                    rounded-lg
                                                    bg-blue-600
                                                    text-white
                                                    text-sm
                                                    font-semibold
                                                    flex
                                                    items-center
                                                    gap-2
                                                    transition
                                                    hover:bg-blue-700
                                                "
                                            >
                                                <LuRefreshCw className="w-4 h-4" />
                                                Try Again
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            </>
                        )}

                            </div>

                        </div>

                    </div>
                )}
        </div>

    );

}