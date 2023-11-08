import React ,{useEffect, useState}from 'react'
import styles from './Loan.module.css';
const Loan = () => {
    const [principle, setPrinciple] = useState(100000)
    const [rate, setRate] = useState(8.85)
    const [tenure, setTenure] = useState(1)
    const [down, setDown] = useState(50000)
    const [emi, setEmi] = useState();
    const [amount, setAmount] = useState(0);
    const [interest, setInterest] = useState();
    const [tableData, setTableData] = useState([]);

    //calculate Emi
    const calculateEmi = () => {
        const _effPrinciple = principle - down;
        const _rate = rate/12/100;
        const _tenure = tenure * 12;
        // _effPrinciple * _rate * (1 + _rate) ** tenure) / (((1 + _rate) ** tenure -1)
        const _emi = Math.round((_effPrinciple * _rate * (1 + _rate) ** _tenure) / ((1 + _rate) ** _tenure - 1));
        setEmi(_emi);
        // console.log(`Emi Rs-${Math.round(_emi)}`);
        const amount = _emi * _tenure;
        setAmount(amount);
        setInterest(amount - _effPrinciple);
    }

    // Initial render as well as subsequent render
    useEffect(()=>{
            calculateEmi();
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [principle,rate,down,tenure])


    const renderHead = () => {
        return <tr>
                    <th colSpan={1}>Inst No</th>
                    <th colSpan={7}>Beg. Balance</th>
                    <th colSpan={7}>EMI</th>
                    <th colSpan={7}>Principle</th>
                    <th colSpan={7}>Interest</th>
                    <th colSpan={7}>End. Balance</th>
                </tr>
    }

    const renderBody = () => {
        return  <>
                {tableData.length !== 0 

                ? tableData.map(row => {
                    return (
                        <tbody>
                            <tr key={Math.random()}>
                                <td style={th_sty} colSpan={1}>{row._no}</td>
                                <td style={th_sty} colSpan={7}><span className={styles.price}>&#x20B9; {row._beg_balance} </span></td>
                                <td style={th_sty} colSpan={7}><span className={styles.price}>&#x20B9; {row._emi} </span></td>
                                <td style={th_sty} colSpan={7}><span className={styles.price}>&#x20B9; {row._principleComp} </span></td>
                                <td style={th_sty} colSpan={7}><span className={styles.price}>&#x20B9; {row._interest} </span></td>
                                <td style={th_sty} colSpan={7}><span className={styles.price}>&#x20B9; {row._endingBalance} </span></td>
                            </tr>

                        </tbody>

                    )
                }

                )

                : <tr ><td style={th_sty} colSpan={36}>Click Calculate button above</td></tr>}

                </>
    }

    const renderTable = () => {
        return (
            <>
                {renderHead()}
                {renderBody()}
            </>
        )
    }
    const createTable = (e) => {
        e.preventDefault();
        const data = [];
        let beginningBalance = principle - down;
        let endingBalance;
        let interestComp;
        let principleComp;
        let _rate = rate/12/100;
        for(let value = 0; value < tenure * 12 ; value++){
            // _rate is annual rate of interest Rate/12/100
            interestComp = Math.round(beginningBalance * _rate);
            principleComp = emi - interestComp;
            endingBalance = beginningBalance - principleComp;
            data.push({
                _no: value,
                _beg_balance: beginningBalance,
                _emi: emi,
                _principleComp : principleComp,
                _interest : interestComp,
                _endingBalance : endingBalance,
            });
            beginningBalance = endingBalance;
        }

        setTableData(data);
    }


    const sty = {
        width:'100%',
        border:'2px solid black',
        borderRadius:'20px',
        minWidth:'500px',
        padding:'2rem'
    }
    const th_sty = {
        border:'1px solid rgb(219, 219, 219)',
        backgroundColor:'aliceblue',
        padding:'10px',
        textAlign:'center',
        borderRadius: '15px',
    }

    const showShortDetails = () => {
        return (<>
                <div>Principle : <span className={styles.price}>&#x20B9; {principle - down} </span></div>
                <div>Initial Payment : <span className={styles.price}>&#x20B9; {down !== 0 ? down : 0 } </span></div>
                <div>Tenure : {tenure * 12} months</div>
                <div>Total Amount : <span className={styles.price}>&#x20B9; {amount} </span></div>
                <div>You Pay extra : <span className={styles.price}>&#x20B9; {interest} </span></div>
                <br />
        </>)

    }

        //to print breakdown statistics
    const showBreakDown = () => {
        return (
            <>
                <table style={sty}>
                    {renderTable()}
                </table>
            </>
        )
    }

    
    const headingSty = {
        color:'#4f4f4f',
        margin:'1rem 10%',
        textAlign: 'center',
        fontFamily:'sans-serif',
        backgroundColor:'white',
        borderRadius:'2rem',
        padding:'2rem',
        width:'90%',
    }
    //to show form
    const showForm = () => {
        return (<>
                    <form className={styles['form-container']}>

                        <div className={styles.field}>
                            <label htmlFor="principle">
                            Amount you need:&#x20B9;
                            </label>
                            <input className={styles.input} type="number" value={principle} onChange={e => setPrinciple(e.target.value)} id='principle' min={100000} max={1500000} step={10000}/>
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="down_payment">
                            Down Payment:&#x20B9;
                            </label>
                            <input className={styles.input} type="number"  value={down} onChange={e => setDown(e.target.value)}  id='down_payment' min={50000} max={principle}   step={5000}/>
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="rate">
                            Rate of Interest(%) 
                            </label>
                            <input className={styles.input} type="number" value={rate} onChange={e => setRate(e.target.value)} id='rate'  min={8.85} max={15} step={0.1}/>
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="time">
                            Time(year)
                            </label>
                            <input className={styles.input} type="number" value={tenure} onChange={e => setTenure(e.target.value)} id='time' min={1} max={10} step={1}/>
                        </div>
                        {emi !== Infinity 
                        ? ( <div>
                                <span style={{fontSize:'2rem',display:'block',textAlign:'center'}}>You will pay monthly </span>
                                <h3 className={`${styles.field} ${styles.emi}`} >Emi : <span className={styles.price}>&#x20B9; {emi}</span></h3>
                                <span style={{fontSize:'2rem',display:'block',textAlign:'center'}} >for <span className={styles.price}>{(tenure * 12).toFixed(1)} </span> months in a row</span>
                            </div>
                          )
                        : null
                        }
                        <div className={styles['button-container']}>
                            <button  className={styles.button} onClick={createTable}>Calculate Detailed Chart</button>
                        </div>


                    </form>
        </>
        )
    }
    // to show all the statistics
    const showStatistics = () => {
        
        return(
            <>
                <div className={styles['show-data']}>
                    {showShortDetails()}
                    {showBreakDown()}
                </div>
            </>
        )
    }

  return (

    <div className={styles.container}>
        <h1 style={headingSty}>Loan EMI Calculator made by Abhimanyu Kumar Roy</h1>
        {showForm()}
        {showStatistics()}
    </div>
  )
}

export default Loan;