import http from 'node:http';
import {randomBytes,pbkdf2Sync} from 'node:crypto';
import worker from './study-worker.mjs';
const username=process.env.BETA_USERNAME||'aj123';
const password=process.env.BETA_PASSWORD;
if(!password||!process.env.SESSION_SECRET)throw new Error('Configure BETA_PASSWORD and SESSION_SECRET before starting');
const salt=randomBytes(16);
const additionalAccounts=[{"username":"aj124","salt":"c9tYLPIM0KYfGaWQGBc9uA==","hash":"cWMLg+cumNUKPp2wppLOyTeWMF9Sz6Z1upOVPicnugw="},{"username":"aj125","salt":"oFBtExDGib3QGU69noV+Zg==","hash":"xGPeLinSU+fi1LYMRNQ9Lr5pNpYTAW2FXAt1igBsLpU="}];
const env={BETA_USERS:JSON.stringify([{username,salt:salt.toString('base64'),hash:pbkdf2Sync(password,salt,100000,32,'sha256').toString('base64')},...additionalAccounts]),BETA_SESSION_SECRET:Buffer.from(process.env.SESSION_SECRET).toString('base64')};
const port=Number(process.env.PORT||10000);
const origin=new URL(process.env.PUBLIC_URL||process.env.RENDER_EXTERNAL_URL||`http://localhost:${port}`).origin;
const server=http.createServer(async(req,res)=>{
 try{
  if(req.url==='/health'){res.writeHead(200,{'Content-Type':'text/plain'});res.end('ok');return;}
  let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>2048){res.writeHead(413);res.end('Request too large');return;}}
  const headers=new Headers();for(const [key,value]of Object.entries(req.headers)){if(value!==undefined)headers.set(key,Array.isArray(value)?value.join(','):value);}
  headers.set('CF-Connecting-IP',(req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown').split(',').at(-1).trim());
  const url=new URL(req.url,origin);if(url.origin!==origin){res.writeHead(400);res.end('Invalid request');return;}
  const request=new Request(url,{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body}:{})});
  const response=await worker.fetch(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(503,{'Content-Type':'text/plain; charset=utf-8'});res.end('服务暂不可用，请稍后再试。');}
});
server.listen(port,'0.0.0.0',()=>console.log(`Listening on port ${port}`));
process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
