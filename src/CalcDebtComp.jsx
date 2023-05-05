import React from 'react';

class CalcDebtComp extends React.Component {
  constructor(props) {
    super(props);
    const { totalDebt, interestRate, loanTerm } = props;
    const floatTotalDebt = parseFloat(totalDebt.toFixed(2));
    const floatInterestRate = parseFloat(interestRate.toFixed(2));
    const intLoanTerm = parseInt(loanTerm);
    const monthlyPayment = ((floatInterestRate / 1200) * floatTotalDebt) + (floatTotalDebt / intLoanTerm);
    const monthlyInterestPaid = ((floatInterestRate / 1200) * floatTotalDebt);
    const totalInterestPaid = ((floatInterestRate / 1200) * floatTotalDebt * intLoanTerm);

    this.state = {
      totalDebt: (parseFloat(floatTotalDebt) + parseFloat(totalInterestPaid)).toFixed(2),
      interestRate: floatInterestRate,
      loanTerm: intLoanTerm,
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      monthlyInterestPaid: parseFloat(monthlyInterestPaid.toFixed(2)),
      monthlyPrincipal: Number((monthlyPayment - monthlyInterestPaid).toFixed(2)),
      breakdown: [],
      totalInterestPaid: parseFloat(totalInterestPaid.toFixed(2)),
      payments: [],
      paymentAmount: '',
    };
  }

  componentDidMount() {
    const { monthlyPayment, monthlyInterestPaid } = this.state;
    const monthlyPrincipal = (monthlyPayment - monthlyInterestPaid).toFixed(2);
    this.setState({ monthlyPrincipal });
    this.calculateBreakdown();
  }

  calculateBreakdown = () => {
    const { totalDebt, totalInterestPaid, loanTerm, monthlyPayment, monthlyPrincipal } = this.state;
    const monthlyInterest = (totalInterestPaid / loanTerm).toFixed(2);
    let balance = parseFloat(totalDebt);
    let interestPaid = 0.00;
    let principalPaid = 0.00;
    let breakdown = [];

    for (let i = 1; i <= loanTerm; i++) {
      interestPaid += parseFloat(monthlyInterest);
      principalPaid += parseFloat(monthlyPrincipal);
      balance = Number((balance - monthlyPayment).toFixed(2));
      breakdown.push({ month: i, monthlyPayment: parseFloat(monthlyPayment.toFixed(2)), interestPaid: parseFloat(interestPaid.toFixed(2)), principalPaid, balance });
    }

    this.setState({
      breakdown
    });
  }

  handleAmountChange = (event) => {
    let amount = parseFloat(event.target.value) 
    this.setState({ paymentAmount: amount });
  }

  displayBreakdown = () => {
    const { totalDebt, loanTerm, monthlyPayment, breakdown, monthlyPrincipal, monthlyInterestPaid } = this.state;
    const breakdownList = breakdown.map(item => {
      return (
        <tr key={item.month}>
          <td>{item.month}</td>
          <td>${item.monthlyPayment.toFixed(2)}</td>
          <td>${item.interestPaid.toFixed(2)}</td>
          <td>${item.principalPaid.toFixed(2)}</td>
          <td>${item.balance.toFixed(2)}</td>
        </tr>
      );
    });

    return (
      <div className="debt-calc">
        <div className="result">
          <div className="result-item">
            <div className="result-label">Total Debt:</div>
            <div className="result-value">${totalDebt}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Monthly Payment:</div>
            <div className="result-value">${monthlyPayment.toFixed(2)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Monthly Interest Paid:</div>
            <div className="result-value">${monthlyInterestPaid.toFixed(2)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Monthly Principal Paid:</div>
            <div className="result-value">${monthlyPrincipal}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Total Interest Paid:</div>
            <div className="result-value">${(monthlyInterestPaid * loanTerm).toFixed(2)}</div>
          </div>
        </div>
        <div className="breakdown">
          <h2>Payment Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Monthly Payment</th>
                <th>Interest Paid</th>
                <th>Principal Paid</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {breakdownList}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  makePayment = (event) => {
    event.preventDefault();
    const { totalDebt, loanTerm, payments, paymentAmount } = this.state;
    const floatPaymentAmount = parseFloat(paymentAmount);
    const newTotalDebt = parseFloat((totalDebt - floatPaymentAmount).toFixed(2));
    const newLoanTerm = loanTerm - 1;
  
    if (floatPaymentAmount < (parseFloat(totalDebt) * 0.01)) {
      alert('Payment must be greater than 1% of total/remaining debt');
      return;
    }

    if (newLoanTerm === 0 && newTotalDebt <= 0) {
      alert('Congratulations! You have paid off your loan.');
      return;
    }
  
    const newMonthlyPayment = parseFloat((newTotalDebt / newLoanTerm).toFixed(2));
    const newMonthlyInterestPaid = ((this.state.interestRate / 1200) * newTotalDebt);
    const newTotalInterest = newMonthlyInterestPaid * newLoanTerm;
    const newMonthlyPrincipal = parseFloat((newMonthlyPayment - newMonthlyInterestPaid).toFixed(2));
    const newPayments = [...payments, floatPaymentAmount];
    const newBalance = parseFloat((newTotalDebt - newMonthlyPrincipal).toFixed(2));
  
    this.setState({
      payments: newPayments,
      totalDebt: newTotalDebt,
      loanTerm: newLoanTerm,
      totalInterestPaid: newTotalInterest,
      monthlyPayment: newMonthlyPayment,
      monthlyInterestPaid: newMonthlyInterestPaid,
      monthlyPrincipal: newMonthlyPrincipal,
      balance: newBalance,
      paymentAmount: '',
    }, this.calculateBreakdown, this.displayBreakdown);
  }
  
  render() {
    const { paymentAmount, payments } = this.state;
    return (
      <>
        
        {this.displayBreakdown()}
        <div className="make-payment">
          <h3>Make a Payment to Recalculate Debt</h3>
          <form onSubmit={(event) => this.makePayment(event, paymentAmount)}>
            <label htmlFor="paymentAmount">Payment Amount:</label>
            <input type="number" id="paymentAmount" name="paymentAmount" step={0.01} value={paymentAmount} onChange={this.handleAmountChange} />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div>
          <h2>Payment History</h2>
          <ul>
            {payments.map((payment, index) => (
              <li key={index}>${payment}</li>
            ))}
          </ul>
        </div>
      </>
    );
  }
}

export default CalcDebtComp;