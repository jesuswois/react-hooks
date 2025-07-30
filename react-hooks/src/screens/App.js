import { useEffect, useState } from "react";

function App() {
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)


  // Formatter de unidades de tiempo
  const formatTimer = (unit) => {
    let result
    switch (unit) {
      case 'ms':
        // Miliseconds
        result = timer
        if(result>999) result = result - (1000*Math.floor(result/1000))
        break;
      case 's':
        // Seconds
        result = Math.floor(timer / 1000)
        if(result>60) result = result-(60*Math.floor(result/60))
        break;
      case 'm':
        // Minutes
        result = Math.floor((timer / 1000)/60)
        if(result>60) result = result - (60*Math.floor(result/60))
        break;
      case 'h':
        // Hours
        result = Math.floor(((timer / 1000)/60)/60)
        break;
    }
    return result
  }
  // LocalStorage Check
  useEffect(() => {
    if (localStorage.getItem('progress')) {
      setTimer(parseInt(localStorage.getItem('progress')))
      // Se debe sincronizar los estados con los guardados
      setIsRunning(!!parseInt(localStorage.getItem('status')))
    } 
  }, [])


  const handleAction = (action) => {
    switch (action) {
      case 'play':
        if (!localStorage.getItem('startTime')) localStorage.setItem('startTime',Date.now())
        localStorage.setItem('status',1)
        localStorage.setItem('unix',Date.now()) 
        localStorage.setItem('progress',timer)
        setIsRunning(true)
        break;
      case 'pause':
        localStorage.setItem('status', 0)
        localStorage.setItem('unix',Date.now())
        localStorage.setItem('progress',timer)
        setIsRunning(false)
        break;
      case 'stop':
        localStorage.setItem('status', 2)
        setIsRunning(false)
        break;
      case 'restart':
        localStorage.removeItem('startTime')
        localStorage.setItem('progress', 0)
        localStorage.setItem('status',0)
        setIsRunning(false)
        setTimer(0)
        break;
    }
  }
  // Cronometro
  useEffect(() => {
    let time
    console.log(Date.now() - parseInt(localStorage.getItem('unix'))  + parseInt(localStorage.getItem('progress')))
    if (localStorage.getItem('status')==1) {
      time = setInterval(() => {
        setTimer(Date.now() - parseInt(localStorage.getItem('unix')) + parseInt(localStorage.getItem('progress')))
      }, 10)
    }
    return () => clearInterval(time)
  }, [isRunning])

  return (
    <div className="App">
      <h1>Index</h1>
      <a href="useCallback">Route</a>
      <br></br>
      <p>{timer}</p>
      <p>Miliseconds: {formatTimer('ms')}</p>
      <p>Seconds: {formatTimer('s')}</p>
      <p>Minutes: {formatTimer('m')}</p>
      <p>Hours: {formatTimer('h')}</p>
      <button onClick={()=>setTimer(prev=>prev+60000)}>Add 1 min</button>
      <br></br>
      {localStorage.getItem('status')!=2 && (<>
        <button disabled={isRunning} onClick={() => handleAction('play')}>Play</button>
        <button disabled={!isRunning} onClick={() => handleAction('pause')}>Pause</button>
        <button onClick={() => handleAction('stop')}>Stop</button>
      </>
      )}
      <button onClick={() => handleAction('restart')}>Restart</button>
    </div>
  );
}

export default App;
