
# Если это читает студент ИКБО-10-23: не доёбывайся ;)
# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/components/models - содержит модели
- src/components/views - содержит визуальные представления 

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Проект Larek

## Описание

Проект Larek представляет собой веб-приложение для управления корзиной покупок, каталогом продуктов и процессом заказа. В проекте используются классы для представления различных компонентов и функциональности приложения.
В проекте применен принцип MVP (Model-View-Presenter), который обеспечивает четкое разделение ответственностей между классами Model и View каждый класс выполняет свою определенную роль:
Model - работа с загрузкой данных по API, сохранение и работа с данными полученными от пользователя.
View - отображает интерфейс для взаимодействия с пользователем, отлавливает и сообщает о произошедших событиях.
EventEmitter выступает в роли Представителя (Presenter) - связывает модели данных с отображением интерфейсов при сработке какого нибудь события, управляя взаимодействием между ними.
## Классы

### models

#### Basket

Класс `Basket` управляет корзиной покупок.

- **Поля:**
  - `_broker: IEvents` - объект для управления событиями.
  - `_items: BasketItem[]` - массив элементов корзины.

- **Методы:**
  - `addItem(item: BasketItem): void` - добавляет элемент в корзину.
  - `removeItem(item: BasketItem): void` - удаляет элемент из корзины.
  - `clear(): void` - очищает корзину.

#### Catalog

Класс `Catalog` управляет каталогом продуктов.

- **Поля:**
  - `_broker: IEvents` - объект для управления событиями.
  - `_products: ProductItem[]` - массив продуктов.

- **Методы:**
  - `addProduct(product: ProductItem): void` - добавляет продукт в каталог.
  - `removeProduct(product: ProductItem): void` - удаляет продукт из каталога.
  - `getProducts(): ProductItem[]` - возвращает массив продуктов.

#### OrderProcess

Класс `OrderProcess` управляет процессом заказа.

- **Поля:**
  - `_broker: IEvents` - объект для управления событиями.
  - `_orderInfo: OrderInfo` - информация о заказе.

- **Методы:**
  - `addBasketInfo(basketInfo: BasketInfo): void` - добавляет информацию о корзине в заказ.
  - `addContactInfo(contactInfo: ContactInfo): void` - добавляет контактную информацию в заказ.
  - `addDeliveryInfo(deliveryInfo: OrderDeliveryInfo): void` - добавляет информацию о доставке в заказ.
  - `clear(): void` - очищает информацию о заказе.

### views

#### BasketView

Класс `BasketView` представляет представление корзины покупок.

- **Поля:**
  - `holder: HTMLElement` - элемент, содержащий представление корзины.
  - `items: BasketItemView[]` - массив представлений элементов корзины.

- **Методы:**
  - `getRendered(): HTMLElement` - возвращает элемент, содержащий представление корзины.

#### CatalogProductView

Класс `CatalogProductView` представляет представление продукта в каталоге.

- **Поля:**
  - `category: HTMLSpanElement` - элемент, содержащий категорию продукта.
  - `holder: HTMLButtonElement` - элемент, содержащий представление продукта.
  - `image: HTMLImageElement` - элемент, содержащий изображение продукта.
  - `title: HTMLHeadingElement` - элемент, содержащий название продукта.
  - `price: HTMLSpanElement` - элемент, содержащий цену продукта.

- **Методы:**
  - `getRendered(): HTMLElement` - возвращает элемент, содержащий представление продукта.

#### ContactsView

Класс `ContactsView` представляет представление контактной информации.

- **Поля:**
  - `_presenter: HTMLFormElement` - элемент, содержащий форму контактной информации.
  - `_broker: IEvents` - объект для управления событиями.
  - `_emailInput: HTMLInputElement` - элемент, содержащий поле ввода email.
  - `_phoneInput: HTMLInputElement` - элемент, содержащий поле ввода телефона.
  - `_error: HTMLSpanElement` - элемент, содержащий ошибки формы.
  - `_submit: HTMLButtonElement` - элемент, содержащий кнопку отправки формы.

- **Методы:**
  - `getRendered(): HTMLElement` - возвращает элемент, содержащий представление контактной информации.

#### ModalWindow

Класс `ModalWindow` управляет модальным окном.

- **Поля:**
  - `Container: HTMLElement` - элемент, содержащий модальное окно.
  - `_broker: IEvents` - объект для управления событиями.
  - `_contentElementHolder: HTMLElement` - элемент, содержащий контент модального окна.

- **Методы:**
  - `open(child: IView): void` - открывает модальное окно с указанным представлением.
  - `close(): void` - закрывает модальное окно.

### Типы данных

#### BasketInfo

Тип `BasketInfo` представляет информацию о корзине.

- **Поля:**
  - `total: number` - общая сумма корзины.
  - `items: BasketItem[]` - массив элементов корзины.

#### ContactInfo

Тип `ContactInfo` представляет контактную информацию.

- **Поля:**
  - `phone: string` - номер телефона.
  - `email: string` - email.

#### OrderDeliveryInfo

Тип `OrderDeliveryInfo` представляет информацию о доставке заказа.

- **Поля:**
  - `address: string` - адрес доставки.
  - `date: string` - дата доставки.

#### ProductItem

Тип `ProductItem` представляет продукт.

- **Поля:**
  - `id: string` - идентификатор продукта.
  - `title: string` - название продукта.
  - `description: string` - описание продукта.
  - `price: number` - цена продукта.
  - `category: string` - категория продукта.
  - `image: string` - изображение продукта.
 
 #### Order

Тип `Order` представляет информацию о заказе.

- **Поля:**
  - `payment: "online" | "cash"` - способ оплаты (онлайн или наличные).
  - `email: string` - email клиента.
  - `phone: string` - номер телефона клиента.
  - `address: string` - адрес доставки.
  - `total: number` - общая сумма заказа.
  - `items: string[]` - массив идентификаторов элементов заказа.

#### SuccessOrder

Тип `SuccessOrder` представляет информацию об успешно завершенном заказе.

- **Поля:**
  - `id: string` - идентификатор заказа.
  - `total: number` - общая сумма заказа.

#### ProductFull

Тип `ProductFull` представляет полную информацию о продукте.

- **Поля:**
  - `product: ProductItem` - объект типа `ProductItem`, представляющий продукт.
  - `available: boolean` - доступность продукта.

### index.ts

Главный файл проекта, который инициализирует и управляет основными компонентами приложения.

- **Поля:**
  - `cardCatalogTemplate: HTMLTemplateElement` - шаблон для каталога продуктов.
  - `productFullTemplate: HTMLTemplateElement` - шаблон для полного представления продукта.
  - `basketItemTemplate: HTMLTemplateElement` - шаблон для элемента корзины.
  - `basketTemplate: HTMLTemplateElement` - шаблон для представления корзины.
  - `orderTemplate: HTMLTemplateElement` - шаблон для представления заказа.
  - `contactsTemplate: HTMLTemplateElement` - шаблон для представления контактной информации.
  - `successTemplate: HTMLTemplateElement` - шаблон для представления успешного завершения заказа.
  - `modalWindowContainer: HTMLElement` - контейнер для модального окна.
  - `larek: LarekApi` - объект для взаимодействия с API.
  - `broker: EventEmitter` - объект для управления событиями.
  - `modalWindow: ModalWindow` - объект для управления модальным окном.
  - `order: OrderProcess` - объект для управления процессом заказа.
  - `basket: Basket` - объект для управления корзиной.

- **Методы:**
  - `handleOutsideModalClicked(evt: MouseEvent): void` - обработчик события клика вне модального окна.
