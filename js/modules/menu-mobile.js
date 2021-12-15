export default function initMenuMobile() {
  const $menuButton = document.querySelector('[data-menu="button"]');
  const $menuItems = document.querySelector('.menu_items');
  const $html = document.documentElement;
  const userEvents = ['click', 'touch'];

  const clickOutside = (event) => {
    if (!$menuItems.classList.contains(event.target)) {
      userEvents.forEach((events) => {
        $html.removeEventListener(events, clickOutside);
      });
      $menuItems.classList.remove('active_menu');
    }
  };

  const openMenu = () => {
    $menuItems.classList.add('active_menu');
    userEvents.forEach((events) => {
      setTimeout(() => {
        $html.addEventListener(events, clickOutside);
      });
    });
  };

  userEvents.forEach((events) => {
    $menuButton.addEventListener(events, openMenu);
  });
}
