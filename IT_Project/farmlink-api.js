window.FarmLinkAPI = {
  async request(path, options={}) {
    const res = await fetch(path, {credentials:'include', headers:{'Content-Type':'application/json', ...(options.headers||{})}, ...options});
    const data = await res.json().catch(()=>({}));
    if(!res.ok) { const err = new Error(data.error || 'Request failed'); err.status = res.status; err.data = data; throw err; }
    return data;
  },
  me(){return this.request('api/auth.php?action=me');},
  login(email,password){return this.request('api/auth.php?action=login',{method:'POST',body:JSON.stringify({email,password})});},
  register(payload){return this.request('api/auth.php?action=register',{method:'POST',body:JSON.stringify(payload)});},
  updateProfile(payload){return this.request('api/auth.php?action=update_profile',{method:'POST',body:JSON.stringify(payload)});},
  products(){return this.request('api/marketplace.php?action=products');},
  livestock(){return this.request('api/marketplace.php?action=livestock');},
  createProduct(payload){return this.request('api/marketplace.php?action=create-product',{method:'POST',body:JSON.stringify(payload)});},
  createLivestock(payload){return this.request('api/marketplace.php?action=create-livestock',{method:'POST',body:JSON.stringify(payload)});},
  drivers(){return this.request('api/drivers.php?action=list');},
  orders(){return this.request('api/marketplace.php?action=orders');},
  createOrder(payload){return this.request('api/marketplace.php?action=create-order',{method:'POST',body:JSON.stringify(payload)});},
  updateOrderStatus(order_id,status){return this.request('api/marketplace.php?action=update-order-status',{method:'POST',body:JSON.stringify({order_id,status})});},
  driverLocation(driver_id){return this.request('api/drivers.php?action=latest-location&driver_id='+encodeURIComponent(driver_id));}
};