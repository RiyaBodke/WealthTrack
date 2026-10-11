import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Home from "./pages/Home"

// PAGE LAYOUT IMPORT
import MainLayout from "./pages/PageLayouts/MainLayout";
import AppLayout from "./pages/PageLayouts/AppLayout";

// PORTFOLIO IMPORT
import PortfolioLayout from "./pages/PageLayouts/PortfolioLayout";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./pages/Portfolio/Dashboard";
import TradeBook from "./pages/Portfolio/TradeBook";
import AddHolding from "./pages/Portfolio/AddHolding";
import History from "./pages/Portfolio/History";
import Transactions from "./pages/Portfolio/Transactions";

// CLIENT MANAGEMENT IMPORT
import UserManagementStructure from "./pages/PageLayouts/UserManagementStructure";
import UserManagement from "./pages/ClientManagement/Clients";
import PendingApprovals from "./pages/ClientManagement/PendingApprovals";
import ClientDetails from "./pages/ClientManagement/ClientDetails";
import TradingWorkspace from "./pages/ClientManagement/TradingWorkspace";
import ActivityLogs from "./pages/ClientManagement/AuditLogs";
import NotificationManagement from "./pages/ClientManagement/NotificationManagement";

// ACCOUNTS IMPORT
import AccountStructure from "./pages/PageLayouts/AccountLayout";
import Help from "./pages/Account/Help";
import Profile from "./pages/Account/Profile";

// AUTHENTICATION IMPORT
import { LogIn, Password } from "./pages/AuthenticationAndAuthorization/LogIn"
import { ForgotEmail } from "./pages/AuthenticationAndAuthorization/ForgotEmail"
import { ForgotPassword } from "./pages/AuthenticationAndAuthorization/ForgotPassword"
import { SignUp } from "./pages/AuthenticationAndAuthorization/SignUp"
import { EmailVerification } from "./pages/AuthenticationAndAuthorization/EmailVerification";

export default function App() {
  
  // const router = createBrowserRouter([
  //   {
  //     path : "/",
  //     element : (
  //       <>
  //         <Navbar />
  //         <Home />
  //       </>
  //     )
  //   },
  // ])

  return (
    <BrowserRouter>

      <Routes>

        <Route element={< MainLayout />} >
        
          <Route path="/" element={<Home />} />                                       {/* Home */}

            <Route element={<AppLayout />}>
            
              <Route path="/portfolio" element={
                  <ProtectedRoute>
                    <PortfolioLayout />
                  </ProtectedRoute>
                }
              >                                                                           {/* Portfolio */}

                <Route index element={<Navigate to="dashboard" replace />} />             {/* Portfolio Navigating to Dashboard */}
                
                <Route path="dashboard" element={<Dashboard />} />                        {/* Dashboard */}
                
                <Route path="holdings">
                  <Route index element={<TradeBook />} />
                  <Route path="add-trade" element={<AddHolding />} />
              </Route>
                
                <Route path="history" element={<History />} />                            {/* History */}

                <Route path="transaction" element={<Transactions />} /> 

              </Route>

              <Route path="user-management" element={<UserManagementStructure />} >      {/* User Management Structure*/}
                  
                <Route index element={<Navigate to="clients" replace />}/>               

                <Route path="clients" element={<UserManagement />}/>                     {/* Clients */}

                <Route path="client-details" element={<ClientDetails />}/>               {/* Client Details */}

                <Route path="pending-approvals" element={<PendingApprovals />}/>         {/* Pending Approvals */}

                <Route path="activity-logs" element={<ActivityLogs />}/>

                <Route path="trading-workspace" element={<TradingWorkspace />}/>

                <Route path="notification-management" element={<NotificationManagement />} />

              </Route>

              <Route element={<AccountStructure />}>

                <Route path="help" element={<Help />} />

                <Route
                    path="profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

            </Route>

          </Route>

        </Route>

        <Route path="/login" element={< LogIn />} />                                    {/* Login */}

        <Route path="/login/password" element={<Password />} />

        <Route path="/login/forgotemail" element={< ForgotEmail />}/>

        <Route path="/login/forgotpassword" element={< ForgotPassword />}/>

        <Route path="/signup" element={< SignUp />} />                                {/* Signup */}

        <Route path="/login/emailverification" element={< EmailVerification />} />          {/* Email Verification */}

      </Routes>
      
    </BrowserRouter>
  )
}