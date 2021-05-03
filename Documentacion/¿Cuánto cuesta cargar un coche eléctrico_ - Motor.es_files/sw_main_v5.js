'use strict';const applicationServerPublicKey='BDNVrZOQCKuDY7kKF2-dIBpoh4aTJSx0-CqWhtDe6BKjO-oVf1yXsMv0ENcsfGX0ISqYi0t3GF95ey7vBMEmyxA';let isSubscribed=false;let swRegistration=null;let pushUrl="https://push.motor.es/";var started=false;function urlB64ToUint8Array(base64String){const padding='='.repeat((4-base64String.length%4)%4);const base64=(base64String+padding).replace(/\-/g,'+').replace(/_/g,'/');const rawData=window.atob(base64);const outputArray=new Uint8Array(rawData.length);for(let i=0;i<rawData.length;++i){outputArray[i]=rawData.charCodeAt(i);}
return outputArray;}
if('serviceWorker'in navigator){console.log('Service Worker is supported');window.addEventListener('load',function(){navigator.serviceWorker.register('/motorsw.js').then(function(swReg){console.log('Service Worker is registered',swReg);swRegistration=swReg;initialiseRegistration();}).catch(function(error){console.error('Service Worker Error',error);});});}else{console.warn('ServiceWorker is not supported');}
function initialiseRegistration(){if('PushManager'in window)
{console.log('Push is supported');swRegistration.pushManager.getSubscription().then(function(subscription){isSubscribed=!(subscription===null);if(Notification.permission==='denied'){console.log('Push Messaging Blocked.');if(localStorage.getItem('motor_id')!=null&&localStorage.getItem('last_update_id')!="unsubscribe")
dropSubscriptionOnServer();return;}
if(isSubscribed){console.log('User IS subscribed.');console.log(JSON.stringify(subscription));var d=new Date();if(localStorage.getItem('motor_id')==null)
refreshSubscription();else if(localStorage.getItem('last_update_id')!="unsubscribe"&&(d.getTime()-parseInt(localStorage.getItem('last_update_id')))/(1000*60*60*24)>7)
refreshSubscription();}
else{console.log('User is NOT subscribed.');subscribeUser();}})}
else if('safari'in window&&'pushNotification'in window.safari)
{var permissionData=window.safari.pushNotification.permission('web.motor');checkRemotePermission(permissionData);}
else
console.warn('Push messaging is not supported');}
function checkRemotePermission(permissionData){if(permissionData.permission==='default'){console.log('User is NOT subscribed.');var guest_id=localStorage.getItem('motor_id');var d=new Date();if(!localStorage.getItem('last_dialog_show')||(d.getTime()-parseInt(localStorage.getItem('last_dialog_show')))/(1000*60*60*24)>7)
{document.getElementById('dialog_notificaciones').style.display="block";localStorage.setItem('last_dialog_show',d.getTime());document.getElementById('denegar_btn').addEventListener("click",function(event){event.preventDefault();document.getElementById('dialog_notificaciones').style.display="none";});document.getElementById('permitir_btn').addEventListener("click",function(event){event.preventDefault();document.getElementById('dialog_notificaciones').style.display="none";if(!started)
{started=true;window.safari.pushNotification.requestPermission(pushUrl+'api/suscriptions','web.motor',{'current_url':window.location.pathname,'seccion':(typeof seccion!=='undefined')?seccion:'false'},checkRemotePermission);}});}}
else if(permissionData.permission==='granted'){var deviceToken=permissionData.deviceToken;isSubscribed=true;console.log('User IS subscribed.');console.log(deviceToken);}
else if(permissionData.permission==='denied')
{isSubscribed=false;console.log('Push Messaging Blocked.');console.log(permissionData);}}
function subscribeUser(){const applicationServerKey=urlB64ToUint8Array(applicationServerPublicKey);swRegistration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:applicationServerKey}).then(function(subscription){console.log('User subscribed successful:');updateSubscriptionOnServer(subscription);isSubscribed=true;}).catch(function(err){console.log('Failed to subscribe the user: ',err);});}
function updateSubscriptionOnServer(subscription){if(subscription){console.log(JSON.stringify(subscription));var guest_id=localStorage.getItem('motor_id');$.ajax({type:'POST',url:pushUrl+'api/suscriptions/add-suscription',dataType:'json',data:{'guest_id':guest_id,'current_url':window.location.pathname,'seccion':(typeof seccion!=='undefined')?seccion:0,'data':JSON.stringify(subscription)},success:function(result){if(result.status=='ok')
{console.log(result.msg);localStorage.setItem('motor_id',result.guest_id);var d=new Date();localStorage.setItem('last_update_id',d.getTime());}
else if(result.status=='ko')
console.error(result.msg);}});}}
function dropSubscriptionOnServer(){var guest_id=localStorage.getItem('motor_id');$.ajax({type:'POST',url:pushUrl+'api/suscriptions/drop-suscription',dataType:'json',data:{'guest_id':guest_id},success:function(result){if(result.status=='ok')
{localStorage.setItem('last_update_id',"unsubscribe");console.log('User is unsubscribed')}
else if(result.status=='ko')
console.error(result.msg);}});}
function refreshSubscription(){swRegistration.pushManager.getSubscription().then(function(subscription){if(subscription){return subscription.unsubscribe();}}).catch(function(error){console.log('Error unsubscribing',error);}).then(function(){console.log('User is unsubscribed.');isSubscribed=false;subscribeUser();});}
function unsubscribeUser(){swRegistration.pushManager.getSubscription().then(function(subscription){if(subscription){return subscription.unsubscribe();}}).catch(function(error){console.log('Error unsubscribing',error);}).then(function(){dropSubscriptionOnServer();isSubscribed=false;});}