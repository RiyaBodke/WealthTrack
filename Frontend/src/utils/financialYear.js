export function getFinancialYear(date = new Date()) {

    const currentDate = new Date(date);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    if (month >= 4) {
        return `${year}-${String(year + 1).slice(-2)}`;
    }

    return `${year - 1}-${String(year).slice(-2)}`;
}

