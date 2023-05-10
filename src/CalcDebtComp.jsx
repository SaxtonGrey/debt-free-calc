import React from 'react';

class CalcDebtComp extends React.Component {
  constructor(props) {
    super(props);
    const { totalDebt, interestRate, loanTerm } = props;
    const floatTotalDebt = parseFloat(totalDebt.toFixed(2));
    const floatInterestRate = parseFloat(interestRate.toFixed(2));
    const intLoanTerm = parseInt(loanTerm);
    const monthlyInterest = parseFloat(((floatInterestRate / 1200) * floatTotalDebt).toFixed(2));
    const monthlyPrincipal = ((floatTotalDebt / intLoanTerm));

    this.state = {
      totalDebt: parseFloat((floatTotalDebt + monthlyInterest).toFixed(2)),
      interestRate: floatInterestRate,
      loanTerm: intLoanTerm,
      monthlyPayment: parseFloat((monthlyPrincipal + monthlyInterest).toFixed(2)),
      monthlyInterest: monthlyInterest,
      monthlyPrincipal: parseFloat(monthlyPrincipal.toFixed(2)),
      breakdown: [],
      payments: [],
      paymentAmount: '',
      interestPaid: 0.00,
    };
  }

  componentDidMount() {
    this.calculateBreakdown();
  }

  calculateBreakdown = () => {
    const { totalDebt, interestRate, loanTerm, monthlyPrincipal, monthlyInterest } = this.state;
    let balance = totalDebt - monthlyInterest;
    let totalInterestPaid = 0.00;
    let breakdown = [];
  
    for (let i = 1; i <= loanTerm; i++) {
      const monthlyInterest = (interestRate / 1200) * balance;
      const monthlyPayment = parseFloat((monthlyPrincipal + monthlyInterest).toFixed(2));
      totalInterestPaid += monthlyInterest;
      balance -= monthlyPrincipal;
      if (i === loanTerm) {
        balance = 0.00;
      }
  
      breakdown.push({
        month: i,
        monthlyPayment: monthlyPayment,
        interestPaid: monthlyInterest,
        principalPaid: parseFloat(monthlyPrincipal),
        balance: parseFloat(balance.toFixed(2))
      });
    }
  
    this.setState({
      breakdown,
      interestPaid: parseFloat(totalInterestPaid.toFixed(2))
    });
  }

  handleAmountChange = (event) => {
    let amount = parseFloat(event.target.value) 
    this.setState({ paymentAmount: amount });
  }

  displayBreakdown = () => {
    const { totalDebt, interestPaid, monthlyPayment, breakdown, monthlyPrincipal, monthlyInterest } = this.state;
    const breakdownList = breakdown.map(item => {
      return (
        <tr key={item.month}>
          <td>{item.month}</td>
          <td>${item.monthlyPayment}</td>
          <td>${item.interestPaid.toFixed(2)}</td>
          <td>${item.principalPaid}</td>
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
            <div className="result-value">${monthlyPayment}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Monthly Interest Paid:</div>
            <div className="result-value">${monthlyInterest}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Monthly Principal Paid:</div>
            <div className="result-value">${monthlyPrincipal}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Total Interest Paid:</div>
            <div className="result-value">${interestPaid}</div>
          </div>
        </div>
        <div className="breakdown">
          <h2>Payment Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Payment</th>
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
    const newTotalDebt = parseFloat(totalDebt) - floatPaymentAmount;
    let newLoanTerm = loanTerm - 1;
  
    if (floatPaymentAmount < (parseFloat(totalDebt) * 0.01) || floatPaymentAmount === 0) {
      alert('Payment must be greater than 1% of total/remaining debt');
      return;
    }
  
    if (newLoanTerm === 0 || newTotalDebt <= 0) {
      newLoanTerm = 1;
      alert('Congratulations! You have paid off your loan.');
    }

    const newMonthlyPrincipal = parseFloat((newTotalDebt / newLoanTerm).toFixed(2));
    const newMonthlyInterestPaid = ((this.state.interestRate / 1200) * newTotalDebt);
    const newMonthlyPayment = parseFloat((newMonthlyPrincipal + newMonthlyInterestPaid).toFixed(2));
    const newPayments = [...payments, floatPaymentAmount];
    const newBalance = parseFloat((newTotalDebt - newMonthlyPrincipal).toFixed(2));
  
    this.setState(
      {
        payments: newPayments,
        totalDebt: (newTotalDebt + newMonthlyInterestPaid).toFixed(2),
        loanTerm: newLoanTerm,
        monthlyPayment: newMonthlyPayment,
        monthlyInterest: newMonthlyInterestPaid.toFixed(2),
        monthlyPrincipal: newMonthlyPrincipal,
        balance: newBalance,
        paymentAmount: '',
      },
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.totalDebt !== this.state.totalDebt) {
      this.calculateBreakdown();
      this.displayBreakdown();
    }
  }
  

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  render() {
    const { paymentAmount, payments } = this.state;
    return (
      <>
        
        <div className='slide-up-animation'>{this.displayBreakdown()}</div>
        <div className="make-payment fade-in">
          <h3>Make a Payment to Recalculate Debt</h3>
          <form onSubmit={(event) => this.makePayment(event, paymentAmount)}>
            <label htmlFor="paymentAmount">Payment Amount:</label>
            <input type="number" id="paymentAmount" name="paymentAmount" step={0.01} onChange={this.handleAmountChange} />
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className='payment-history fade-in'>
          <h2>Payment History</h2>
          <ul>
            {payments.map((payment, index) => (
              <li key={index}>${payment}</li>
            ))}
          </ul>
        </div>
        <div onClick={this.scrollToTop} className='back-to-top'><i className='fa-solid fa-arrow-up'><br /><span>Back to Top</span></i></div>
      </>
    );
  }
}

export default CalcDebtComp;