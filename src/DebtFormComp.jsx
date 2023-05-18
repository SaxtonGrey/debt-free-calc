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
    const minPayment = totalDebt * 0.01;
    const newLoanTerm = loanTerm === 0.00 || loanTerm === "0" ? (totalDebt / minPayment).toString() : loanTerm.toString();
    this.setState({ totalDebt, interestRate, loanTerm: newLoanTerm, calculated: true });
  };
  
  render() {
    const { totalDebt, interestRate, loanTerm, calculated } = this.state;
    const inputFields = [
      {
        label: "Total Debt Amount",
        id: "totalDebt",
        name: "totalDebt",
        value: totalDebt,
        onChange: (event) => this.setState({ totalDebt: event.target.value, calculated: false }),
        required: true,
        pattern: "[0-9]*",
        type: "number"
      },
      {
        label: "Interest Rate",
        id: "interestRate",
        name: "interestRate",
        value: interestRate,
        onChange: (event) => this.setState({ interestRate: event.target.value, calculated: false }),
        required: true,
        pattern: "[0-9]*",
        type: "number",
        step: 0.01,
        min: 0.0
      },
      {
        label: "Loan Term In Months",
        id: "loanTerm",
        name: "loanTerm",
        value: loanTerm,
        onChange: (event) => this.setState({ loanTerm: event.target.value, calculated: false }),
        required: true,
        pattern: "[0-9]*",
        type: "number"
      }
    ];
  
    return (
      <div className="debt-form-container">
        <form onSubmit={this.handleSubmit} className="debt-form">
          {inputFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              {field.id === "interestRate" ? (
                <div id="interestRateInput">
                  <input {...field} />
                  <span id="interestRateSymbol">%</span>
                </div>
              ) : (
                <div className="dollar-input">
                  <span className="dollar-sign">$</span>
                  <input {...field} />
                </div>
              )}
            </div>
          ))}
          <button type="submit">Calculate</button>
        </form>
        <div className="debt-calc-container slide-up-animation">
          {!calculated && <h2>Enter your debt to see breakdown</h2>}
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
