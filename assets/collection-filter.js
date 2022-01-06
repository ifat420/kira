class CollecitonFilterForm extends HTMLElement {
    constructor() {
        super();
        this.filterTitleBtn = document.querySelectorAll('.collection-filter-btn');
        
        if (this.filterTitleBtn) {
            this.filterTitleBtn.forEach(btn => { 
                btn.addEventListener('click', this.onFilterTitleBtnClick)    
            })
        }
        
        this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

        this.debouncedOnSubmit = debounce((event) => {
            this.onSubmitHandler(event);
        }, 500);

        this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));    
    }

    static setListeners() {
        const onHistoryChange = (event) => {
            const searchParams = event.state ? event.state.searchParams : CollecitonFilterForm.searchParamsInitial;
            if (searchParams == CollecitonFilterForm.searchParamsPrev) return;
            CollecitonFilterForm.renderPage(searchParams, null, false);
        }
        window.addEventListener('popstate', onHistoryChange);
    }

    static toggleActiveFacets(disable = true) {
        document.querySelectorAll('.js-facet-remove').forEach((element) => {
            element.classList.toggle('disabled', disable);
        });
    }

    static renderPage(searchParams, event, updateURLHash = true) {
        CollecitonFilterForm.searchParamsPrev = searchParams;
           const sections = CollecitonFilterForm.getSections();
        const countContainer = document.getElementById('ProductCount');
        const countContainerDesktop = document.getElementById('ProductCountDesktop');
        document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');
     
        if (countContainer){
          countContainer.classList.add('loading');
        }
        if (countContainerDesktop){
          countContainerDesktop.classList.add('loading');
        }
    
        sections.forEach((section) => {
          const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
        
          const filterDataUrl = element => element.url === url;
    
          CollecitonFilterForm.filterData.some(filterDataUrl) ?
            CollecitonFilterForm.renderSectionFromCache(filterDataUrl, event) :
            CollecitonFilterForm.renderSectionFromFetch(url, event);
        });
    
        if (updateURLHash) CollecitonFilterForm.updateURLHash(searchParams);
    }

    static renderSectionFromFetch(url, event) {
        fetch(url)
          .then(response => response.text())
          .then((responseText) => {
            const html = responseText;
            CollecitonFilterForm.filterData = [...CollecitonFilterForm.filterData, { html, url }];
            // CollecitonFilterForm.renderFilters(html, event);
            CollecitonFilterForm.renderProductGridContainer(html);
            // CollecitonFilterForm.renderProductCount(html);
          });
      }

    static renderSectionFromCache(filterDataUrl, event) {
        const html = CollecitonFilterForm.filterData.find(filterDataUrl).html;
        // CollecitonFilterForm.renderFilters(html, event);
        CollecitonFilterForm.renderProductGridContainer(html);
        // CollecitonFilterForm.renderProductCount(html);
    }

    static renderProductGridContainer(html) {
        document.getElementById('ProductGridContainer').innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductGridContainer').innerHTML;
    }
    

    static renderProductCount(html) {
        const count = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCount').innerHTML
        const container = document.getElementById('ProductCount');
        const containerDesktop = document.getElementById('ProductCountDesktop');
        container.innerHTML = count;
        container.classList.remove('loading');
        if (containerDesktop) {
          containerDesktop.innerHTML = count;
          containerDesktop.classList.remove('loading');
        }
    }
    

    static renderFilters(html, event) {
        const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
    
        const facetDetailsElements =
          parsedHTML.querySelectorAll('#CollecitonFilterForm .js-filter, #CollecitonFilterFormMobile .js-filter');
        const matchesIndex = (element) => {
          const jsFilter = event ? event.target.closest('.js-filter') : undefined;
          return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
        }
        const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
        const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);
    
        facetsToRender.forEach((element) => {
          document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
        });
    
        CollecitonFilterForm.renderActiveFacets(parsedHTML);
        CollecitonFilterForm.renderAdditionalElements(parsedHTML);
    
        if (countsToRender) CollecitonFilterForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
    }

    static renderActiveFacets(html) {
        const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];
    
        activeFacetElementSelectors.forEach((selector) => {
          const activeFacetsElement = html.querySelector(selector);
          if (!activeFacetsElement) return;
          document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
        })
    
        CollecitonFilterForm.toggleActiveFacets(false);
    }

    static renderAdditionalElements(html) {
        const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];
    
        mobileElementSelectors.forEach((selector) => {
          if (!html.querySelector(selector)) return;
          document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
        });
    
        // document.getElementById('CollecitonFilterFormMobile').closest('menu-drawer').bindEvents();
    }

    static renderCounts(source, target) {
        const targetElement = target.querySelector('.facets__selected');
        const sourceElement = source.querySelector('.facets__selected');
    
        if (sourceElement && targetElement) {
          target.querySelector('.facets__selected').outerHTML = source.querySelector('.facets__selected').outerHTML;
        }
    }

    static updateURLHash(searchParams) {
        console.log("🚀 ~ file: facets.js ~ line 153 ~ CollecitonFilterForm ~ updateURLHash ~ searchParams", searchParams)
        history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
    }

    static getSections() {
        return [
          {
            section: document.getElementById('product-grid').dataset.id,
          }
        ]
    }

    onSubmitHandler(event) {
        event.preventDefault();
        const formData = new FormData(event.target.closest('form'));
        const searchParams = new URLSearchParams(formData).toString();
        CollecitonFilterForm.renderPage(searchParams, event);
    }

    onActiveFilterClick(event) {
        event.preventDefault();
        CollecitonFilterForm.toggleActiveFacets();
        const url = event.currentTarget.href.indexOf('?') == -1 ? '' : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
       
        CollecitonFilterForm.renderPage(url);
    }
    
    onFilterTitleBtnClick(event) {
        let listDiv = document.getElementById(this.dataset.flist);
        listDiv.classList.toggle('collection-filter-container-extend');
    }

    
}

CollecitonFilterForm.filterData = [];
CollecitonFilterForm.searchParamsInitial = window.location.search.slice(1);
CollecitonFilterForm.searchParamsPrev = window.location.search.slice(1);

customElements.define('collection-filter-form', CollecitonFilterForm);
CollecitonFilterForm.setListeners();