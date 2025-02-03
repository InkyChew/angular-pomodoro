addEventListener("message",({data:s})=>{let e=s;setInterval(()=>{e-=1e3,postMessage(e)},1e3)});
