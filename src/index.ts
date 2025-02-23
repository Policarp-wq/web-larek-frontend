import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/larekApi';
import { Catalog } from './components/models/catalog';
import { CatalogView } from './components/views/catalogView';
import './scss/styles.scss';
import { API_URL } from './utils/constants';

const larek = new LarekApi(API_URL);
const broker = new EventEmitter();
larek.getProductsList().then(ls => {
    const catalog = new Catalog(ls.items);
    const catalogView = new CatalogView(broker, catalog, document.querySelector(".gallery"));
})