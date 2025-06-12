export function clockWidget() {
  const dashTime = document.getElementById('dashTime');
  const dashDate = document.getElementById('dashDate');

  console.log('clockWidget');

  function updateClock() {
    const now = new Date();
    dashTime.textContent = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    dashDate.textContent = now.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }

  updateClock();
  setInterval(updateClock, 1000);
}