import React from 'react';
import CalcDebtComp from './CalcDebtComp';

class DebtFormComp extends React.Component {
  constructor() {
    super();
    this.state = { totalDebt: 0, interestRate: 0, loanTerm: 0, calculated: false }
  }

  handleSubmit = (event) => {
    event.preventDefault();
  
    const { totalDebt, interestRate, loanTerm } = this.state;
  
    let newLoanTerm = loanTerm;
    if (loanTerm === 0.00 || loanTerm === "0") {
      console.log('...working');
      
      const tempMonthInt = parseFloat(((interestRate / 1200) * totalDebt).toFixed(2));
      const tempTotalDebt = totalDebt + tempMonthInt;
      const minPayment = tempTotalDebt * 0.01;
      newLoanTerm = tempTotalDebt / minPayment;
      console.log(newLoanTerm);
    }  
    this.setState({ totalDebt, interestRate, loanTerm: newLoanTerm, calculated: true });
  };
  

  render() {
    const { totalDebt, interestRate, loanTerm, calculated } = this.state;
    return (
      <div className='debt-form-container'>
        <form onSubmit={this.handleSubmit} className='debt-form'>
          <div>
            <label htmlFor="totalDebt">Total Debt Amount</label>
            <div className="dollar-input">
              <span className="dollar-sign">$</span>
              <input
                type="number"
                id="totalDebt"
                name="totalDebt"
                value={totalDebt}
                onChange={(event) => this.setState({ totalDebt: event.target.value, calculated: false })}
                required
                pattern="[0-9]*"
              />
            </div>
          </div>
          <div>
            <label htmlFor="interestRate">Interest Rate</label>
            <div id="interestRateInput">
              <input
                type="number"
                step={0.01}
                id="interestRate"
                name="interestRate"
                value={interestRate}
                onChange={(event) => this.setState({ interestRate: event.target.value, calculated: false })}
                required
                pattern="[0-9]*"
              />
              <span id="interestRateSymbol">%</span>
            </div>
          </div>
          <div>
            <label htmlFor="loanTerm">Loan Term In Months</label>
            <input
              type="number"
              id="loanTerm"
              name="loanTerm"
              value={loanTerm}
              onChange={(event) => this.setState({ loanTerm: event.target.value, calculated: false })}
              required
              pattern="[0-9]*"
            />
          </div>
          <button type="submit">Calculate</button>
        </form>
        <div className='debt-calc-container slide-up-animation'>
          {!calculated && <h2>Enter in your debt to see breakdown</h2>}
          {calculated && (
            <CalcDebtComp
              totalDebt={parseFloat(totalDebt)}
              interestRate={parseFloat(interestRate)}
              loanTerm={parseFloat(loanTerm)}
            />
          )}
        </div>
      </div>
    );
  }
}

export default DebtFormComp;
