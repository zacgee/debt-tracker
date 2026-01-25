const debts = [
  { name: "Credit Card", balance: 12000, rate: 0.24, min: 400 },
  { name: "Car Loan", balance: 8000, rate: 0.06, min: 250 },
  { name: "Student Loan", balance: 15000, rate: 0.05, min: 200 },
  { name: "Personal Loan", balance: 5000, rate: 0.10, min: 150 },
];

function snowballMethod(inputDebts, extraPayment) {
  const debts = inputDebts.map(d => ({ ...d }));

  let month = 0;
  const paidOff = new Set();
  const payoffOrder = [];
  let totalInterestPaid = 0;
  const paymentSchedule = [];

  while (debts.some(d => d.balance > 0.01)) {
    month++;

    // find smallest active debt each month (snowball target)
    const activeDebts = debts
      .filter(d => d.balance > 0.01)
      .sort((a, b) => a.balance - b.balance);

    const targetName = activeDebts[0].name;

    const monthRecord = { month, payments: [], interestAccrued: [] };

    // 1) accrue interest first
    for (const d of debts) {
      if (d.balance <= 0.01) continue;

      const monthlyRate = d.rate / 12;
      const interest = d.balance * monthlyRate;
      d.balance += interest;

      totalInterestPaid += interest;
      monthRecord.interestAccrued.push({ name: d.name, interest });
    }

    // 2) make payments
    for (const d of debts) {
      if (d.balance <= 0.01) continue;

      let payment = d.min;
      if (d.name === targetName) payment += extraPayment;

      if (payment > d.balance) payment = d.balance;

      d.balance -= payment;

      // avoid tiny negative balances from floating point issues
      if (d.balance < 0.01) d.balance = 0;

      if (d.balance === 0 && !paidOff.has(d.name)) {
        paidOff.add(d.name);
        payoffOrder.push({ name: d.name, month });
        console.log(`Paid off ${d.name} in month ${month}`);
      }

      monthRecord.payments.push({
        name: d.name,
        payment,
        remainingBalance: d.balance
      });
    }

    paymentSchedule.push(monthRecord);

    // safety guard in case mins are too low to ever pay interest
    if (month > 1200) throw new Error("Simulation exceeded 1200 months (check payments vs interest).");
  }

  const totalPaid = paymentSchedule.reduce(
    (total, record) => total + record.payments.reduce((sum, p) => sum + p.payment, 0),
    0
  );

  return { paymentSchedule, totalMonths: paymentSchedule.length, totalPaid, totalInterestPaid };
}

// Example usage:
const extraPayment = 200;
const result = snowballMethod(debts, extraPayment);

console.log("Debt Repayment Schedule:");
result.paymentSchedule.forEach(record => {
  console.log(`Month ${record.month}:`);

  record.interestAccrued.forEach(i => console.log(`  Interest ${i.name}: $${i.interest.toFixed(2)}`));

  record.payments.forEach(p => {
    console.log(`  Paid $${p.payment.toFixed(2)} toward ${p.name}, Remaining: $${p.remainingBalance.toFixed(2)}`);
  });
});

console.log("\nPayoff order:");
payoffOrder.forEach((x, i) => {
  console.log(`${i + 1}. ${x.name} (Month ${x.month})`);
});


console.log(`Total Months to Pay Off All Debts: ${result.totalMonths}`);
console.log(`Total Amount Paid: $${result.totalPaid.toFixed(2)}`);
console.log(`Total Interest Paid: $${result.totalInterestPaid.toFixed(2)}`);
