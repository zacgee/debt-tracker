const debts = [
    {name: "Credit Card", balance: 12000, rate: 0.24, min: 400  },
    {name: "Car Loan", balance: 8000, rate: 0.06, min: 250  },
    {name: "Student Loan", balance: 15000, rate: 0.05, min: 200  },
    {name: "Personal Loan", balance: 5000, rate: 0.10, min: 150  },
]

function snowballMethod(debts, extraPayment) {
    // Sort debts by balance (smallest to largest)
    debts.sort((a, b) => a.balance - b.balance);

    let month = 0;
    const paymentSchedule = [];

    while (debts.some(debt => debt.balance > 0)) {
        month++;
        let monthRecord = { month, payments: [] };

        for (let debt of debts) {
            if (debt.balance <= 0) continue;

            let payment = debt.min;
            if (debt === debts[0]) {
                payment += extraPayment; // Apply extra payment to smallest debt
            }

            if (payment > debt.balance) {
                payment = debt.balance; // Pay off the debt if payment exceeds balance
            }

            debt.balance -= payment;
            monthRecord.payments.push({ name: debt.name, payment, remainingBalance: debt.balance });
        }

        paymentSchedule.push(monthRecord);
    }

    return paymentSchedule;
}

// Example usage:
const extraPayment = 200; // Extra amount to pay each month
const schedule = snowballMethod(debts, extraPayment);

console.log("Debt Repayment Schedule:");
schedule.forEach(record => {
    console.log(`Month ${record.month}:`);
    record.payments.forEach(payment => {
        console.log(`  Paid $${payment.payment} towards ${payment.name}, Remaining Balance: $${payment.remainingBalance.toFixed(2)}`);
    });
});
console.log(`Total Months to Pay Off All Debts: ${schedule.length}`);
console.log(`Total Amount Paid: $${schedule.reduce((total, record) => total + record.payments.reduce((sum, p) => sum + p.payment, 0), 0).toFixed(2)}`);
console.log(`Total Interest Paid: $${schedule.reduce((total, record) => total + record.payments.reduce((sum, p) => {
    const debt = debts.find(d => d.name === p.name);
    const interest = (debt.rate / 12) * (p.remainingBalance + p.payment);
    return sum + interest;
}, 0), 0).toFixed(2)}`);
