Привет! Это Mursu Sushi Restaurant, fullstack веб-приложение для ресторана суши. В проекте есть две роли: клиент, который выбирает блюда, оформляет и оплачивает заказ, и администратор, который управляет меню, ингредиентами, спецпредложениями и статусами заказов.

Сначала главная страница. Здесь пользователь знакомится с брендом и концепцией ресторана. На главной есть анимации интерфейса и параллакс-эффект для привлечения внимания и создания непринежденной атмосферы, а также описание ресторана, контакты, адрес, карта и быстрые переходы к ключевым разделам.

Дальше страница меню. Здесь отображаются блюда из backend API, которые задаются вручную администратором в админ панели. Пользователь может искать блюда, фильтровать по категориям и сортировать список. Также меню разделено на блюда, доступные сегодня, и блюда, недоступные сегодня. Показываются цены и dietary-бейджи, можно добавлять блюда в корзину, менять количество, удалять позиции и добавлять блюда в избранное для авторизованных пользователей. Здесь же показывается daily special со скидкой 10 процентов, которые также задаются вручную администратором в админ панели.

Следующий раздел это конструктор комбо. Здесь пользователь не выбирает заранее созданное для него блюда, а собирает собственный сет из ингредиентов - базы, начинок и топпинга. Ингредиенты и их типы, а также текущая доступной так же задаются в админ панели. В комбо-билдере поддерживается drag-and-drop и мобильный режим выбора. Структура комбо валидируется, поэтому без обязательных слоев добавить сет в корзину нельзя. После корректной сборки комбо добавляется в корзину как отдельная позиция.

На странице авторизации доступны регистрация и вход для обычного пользователя, а также отдельный сценарий для администратора. В приложении реализован ролевой доступ, поэтому после входа пользователь и админ видят разные сценарии и разные разделы.

Дальше корзина. Она сохраняется и для гостя, и для авторизованного пользователя. В корзине можно просматривать состав заказа, менять количество, удалять позиции, выбирать тип доставки заказа, указывать адрес для доставки и видеть итоговую сумму заказа с уже примененными скидками. В системе есть две скидки: 10 процентов на блюдо дня и 10 процентов на каждый шестой заказ авторизованного пользователя. Доставка в сервисе всегда бесплатная. Оплата интегрирована через Stripe и провести ее может только авторизованный пользователь. После успешной оплаты создается заказ.

После оформления заказа пользователь автоматически попадает в трекинг заказа. Там виден статус заказа в реальном времени, оценка времени приготовления заказ и маршрут до ресторана (лябо для курьера, либо для пользователя, в зависимости от типа доставки). Для маршрутов используются HSL Digitransit для общественного транспорта и OpenRouteService для автомобиля. Когда администратор меняет статус заказа, изменения мгновенно отображаются у пользователя в трекере благодаря Server-Sent Events. Когда заказ исполнен, трекер становится неактивным и интерфейс предлагает пользователю вернутся на сайт и сделать новый заказ.

У каждого зарегистрированного пользователя есть личный профиль. В профиле пользователя можно обновлять личные данные, просматривать дату регистрации и отслеживать количество полученных stamps, включая информацию о том, сколько stamps осталось до следующей скидки.

Все страницы пользовательского интерфейса адаптивны, имеют десктопные и мобильные версии.

_____

Теперь админ-панель. Клиентские страницы недоступны администратору, и наоборот. Для входа администратор использует форму логина с учетными данными администратора или создает новый аккаунт через отдельную форму с секретным словом, заданным на бэкенде.

В разделе Live Orders администратор видит активные заказы и меняет их статусы в процессе работы. Эти изменения сразу видны клиенту в трекере заказа.

В разделе Menu Editor администратор создает, редактирует и отключает блюда для общего меню и ингредиенты для комбо билдера. Изменения отражаются на клиентской странице меню после обновления страницы.

В разделе Daily Special администратор назначает special dish на текущий день и другие даты, что в верный день отображается в специальной плашке в меню пользователя.

В разделе Customers администратор работает с пользовательскими данными, применяет скидки и вручную корректирует количество stamps при необходимости. После этого изменения отображаются в профиле пользователя.

Также в приложении есть локализация и темы. Пользователь может переключать язык интерфейса, получать backend-ошибки на выбранном языке и менять тему между светлой и темной.

Итог: проект покрывает полный цикл ресторанного заказа, от выбора блюд и оплаты до админского управления и трекинга в реальном времени.








Hello! This is Mursu Sushi Restaurant, a fullstack web application for a sushi restaurant. The application has two roles for the users: a customer, who selects dishes, places and pays for an order, and an administrator, who manages the menu, ingredients, special offers and order statuses.

First, the home page. Here the user gets familiar with the brand and the concept of the restaurant. The home page has interface animations and a parallax effect to attract attention and create a relaxed atmosphere, as well as a restaurant description, contacts, address, map and quick navigation to key sections.

Next is the menu page. Here dishes from the backend API are displayed, which are manually configured by the administrator in the admin panel. The user can search dishes, filter by categories and sort the list. The menu is also divided into dishes available today and dishes unavailable today. Prices and dietary badges are shown, users can add dishes to the cart, change quantities, remove items and add dishes to favorites for authorized users. The daily special with a 10 percent discount is also shown here, which is also manually configured by the administrator in the admin panel.

The next section is the combo builder. Here the user does not select a pre-created dish, but assembles a custom set from ingredients - a base, fillings and a topping. Ingredients, their types and their current availability are also configured in the admin panel. The combo builder supports drag-and-drop and a mobile selection mode. The combo structure is validated, so it is impossible to add a set to the cart without the required layers. After successful validation the combo is added to the cart as a separate item.

On the authorization page registration and login are available for a regular user, as well as a separate flow for the administrator. The application has role-based access, so after login the user and the admin see different flows and different sections.

Next is the cart. It is stored both for a guest and for an authorized user. In the cart the user can view the order contents, change quantities, remove items, select the delivery type, enter a delivery address and see the final order price with already applied discounts. The system has two discounts: 10 percent for the dish of the day and 10 percent for every sixth order of an authorized user. Delivery in the service is always free. Payment is integrated through Stripe and can only be completed by an authorized user. After successful payment an order is created.

After placing the order the user is automatically redirected to order tracking. There the user can see the order status in real time, the estimated preparation time and the route to the restaurant (either for the courier or for the user, depending on the delivery type). HSL Digitransit is used for public transport routes and OpenRouteService for car routes. When the administrator changes the order status, the changes are instantly shown to the user in the tracker thanks to Server-Sent Events. When the order is completed, the tracker becomes inactive and the interface suggests that the user return to the website and place a new order.

Each registered user has a personal profile. In the user profile it is possible to update personal information, view the registration date and track the number of earned stamps, including information about how many stamps remain until the next discount.

All user interface pages are adaptive and have desktop and mobile versions.

⸻

Now the admin panel. Client pages are unavailable to the administrator, and vice versa. To log in, the administrator uses a login form with administrator credentials or creates a new account through a separate form with a secret word configured on the backend.

In the Live Orders section the administrator sees active orders and changes their statuses during the workflow. These changes are immediately visible to the customer in the order tracker.

In the Menu Editor section the administrator creates, edits and disables dishes for the general menu and ingredients for the combo builder. The changes appear on the client menu page after a page refresh.

In the Daily Special section the administrator assigns a special dish for the current day and other dates, which on the correct day is displayed in a special banner in the user menu.

In the Customers section the administrator works with user data, applies discounts and manually adjusts the number of stamps if necessary. After that the changes are reflected in the user profile.

The application also has localization and themes. The user can switch the interface language, receive backend errors in the selected language and switch between light and dark themes.

In conclusion: the project covers the full restaurant order cycle, from dish selection and payment to admin management and real-time tracking.