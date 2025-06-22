async function loadProfile() {
  const response = await fetch('/api/user/profile', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  const user = await response.json();
  
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;
  // Другие поля
}