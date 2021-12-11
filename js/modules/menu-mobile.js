export default function initMenuMobile() {
  const $menuButton = document.querySelector('[data-menu="button"]');
  const $menuItems = document.querySelector('.menu_items');
  const $html = document.documentElement;
  const userEvents = ['click', 'touch'];

  const openMenu = () => {
    $menuItems.classList.add('active_menu');

    userEvents.forEach(userEvents => {
      setTimeout(() => {
        $html.addEventListener(userEvents, clickOutside);
      })
    })
  }

  const clickOutside = (event) => {
    if(!$menuItems.classList.contains(event.target)){
      userEvents.forEach(userEvents => {
        $html.removeEventListener(userEvents, clickOutside);
			});
      $menuItems.classList.remove('active_menu');
    }
  }

  userEvents.forEach(userEvents => {
    $menuButton.addEventListener(userEvents, openMenu);
  })
}