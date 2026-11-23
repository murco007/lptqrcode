// These are public application settings. No backend secrets belong in this file.
const CLOUD_CONFIG={"supabaseUrl":"https://nzqsnafmbipquihgikeu.supabase.co","publishableKey":"sb_publishable_Q6MXbeOla4Lfh0HlH4Ph2g_RIq-S80q","functionName":"ordering"};
const staffSessionKey='tangdaren-cloud-staff-v1';
const rootUrl=new URL('./',location.href);
function siteHref(value){const u=new URL(value,'https://route.internal');const result=new URL(rootUrl);result.search=u.search;if(u.pathname!=='/')result.searchParams.set('page',u.pathname);return result.href;}
window.siteHref=siteHref;
function wireLinks(){document.querySelectorAll('a[href^="/"]').forEach(link=>{const href=link.getAttribute('href');if(href.startsWith('/api/export')){link.href='#';link.dataset.cloudExport=href;return;}if(!href.startsWith('//'))link.href=siteHref(href);});}
new MutationObserver(wireLinks).observe(document.documentElement,{childList:true,subtree:true});
async function cloudFetch(path,options={}){
 const headers=new Headers(options.headers);headers.set('apikey',CLOUD_CONFIG.publishableKey);
 const token=sessionStorage.getItem(staffSessionKey);if(token)headers.set('x-staff-session',token);
 const result=await fetch(CLOUD_CONFIG.supabaseUrl+'/functions/v1/'+CLOUD_CONFIG.functionName+path,{...options,headers});
 if(path==='/api/login'&&result.ok){const payload=await result.clone().json();sessionStorage.setItem(staffSessionKey,payload.session);}
 if(path==='/api/logout')sessionStorage.removeItem(staffSessionKey);
 return result;
}
document.addEventListener('click',async event=>{const link=event.target.closest('[data-cloud-export]');if(!link)return;event.preventDefault();try{const response=await cloudFetch(link.dataset.cloudExport);if(!response.ok){const data=await response.json();throw Error(data.error||'�ץX����');}const url=URL.createObjectURL(await response.blob());const a=document.createElement('a');a.href=url;a.download='tangdaren-'+(new URL(link.dataset.cloudExport,'https://route.internal').searchParams.get('day')||'report')+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(error){alert(error.message);}},true);


