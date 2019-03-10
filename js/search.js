'use strict';

/* global instantsearch */

var search = instantsearch({
  appId: 'HQ2JTF16MK',
  apiKey: '678094efc0f2a1927f601e42ab17f244',
  indexName: 'per_posts_product',
  attributesForFaceting: [
        'taxonomies.poduct_tag' // or 'filterOnly(brand)' for filtering purposes only
      ],
  routing: true
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#q',
    placeholder: 'Search a product'
  })
);

search.addWidget(
  instantsearch.widgets.stats({
    container: '#stats'
  })
);

search.on('render', function() {
  $('.product-picture img').addClass('transparent');
  $('.product-picture img').one('load', function() {
      $(this).removeClass('transparent');
  }).each(function() {
      if(this.complete) $(this).load();
  });
});

var hitTemplate =
  `<article class="hit">
    <div class="product-picture-wrapper">
      <a href="{{{permalink}}}" class="product-name">
        <div class="product-picture"><img src="{{images.thumbnail.url}}" /></div>
      </a>
    </div>
    <div class="product-desc-wrapper">
      <a href="{{{permalink}}}" class="product-name">{{{_highlightResult.post_title.value}}}</a>
        <div id="prices">`+`$`+`{{price}}</div>
      <div class"product-info">
        <p class="summary"><span class="title">Materials:</span>{{#taxonomies.pa_mwc_material}}<span class="badge">{{.}}</span> {{/taxonomies.pa_mwc_material}}</p>
        <p class="summary"><span class="title">Style:</span>{{#taxonomies.pa_mwc_type}}<span class="badge">{{.}}</span> {{/taxonomies.pa_mwc_type}}</p>
        <p class="summary"><span class="title">Tube:</span>{{#taxonomies.pa_tube}}<span class="badge">{{.}}</span> {{/taxonomies.pa_tube}}</p>
       
      </div>
        <div id="desc" class="product-type">{{{_highlightResult.content.value}}}</div>
    </div>
  </article>`;

var noResultsTemplate =
  '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>';

var menuTemplate =
  '<a href="javascript:void(0);" class="facet-item {{#isRefined}}active{{/isRefined}}"><span class="facet-name"><i class="fa fa-angle-right"></i> {{label}}</span class="facet-name"></a>';

var facetTemplateCheckbox =
  '<a href="javascript:void(0);" class="facet-item">' +
    '<input type="checkbox" class="{{cssClasses.checkbox}}" value="{{label}}" {{#isRefined}}checked{{/isRefined}} >{{label}}' +
    '<span class="facet-count">({{count}})</span>' +
  '</a>';

var facetTemplateColors =
  '<a href="javascript:void(0);" data-facet-value="{{label}}" class="facet-color {{#isRefined}}checked{{/isRefined}}"></a>';

function trimDesc(){
  var desc = $("#desc").val();
  var maxlength = 140;
  // Trim the field if it has content over the maxlength.
  if (desc.length > maxlength) {
    $("#desc").val(desc.slice(0, maxlength)+"...");
  }
}

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    hitsPerPage: 2,
    templates: {
      empty: noResultsTemplate,
      item: hitTemplate
    },
    transformData: function(hit) {
      var hitdesc = hit._highlightResult.content.value;
      var maxlength = 140;
      // Trim the field if it has content over the maxlength.
      if(hitdesc.length > maxlength) {
        hit._highlightResult.content.value = hitdesc.slice(0, maxlength) + "...";
      }
      // End Trim
      hit.stars = [];
      for (var i = 1; i <= 5; ++i) {
        hit.stars.push(i <= hit.rating);
      }
      return hit;
    }

  }),
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
    cssClasses: {
      active: 'active'
    },
    labels: {
      previous: '<i class="fa fa-angle-left fa-2x"></i> Previous page',
      next: 'Next page <i class="fa fa-angle-right fa-2x"></i>'
    },
    showFirstLast: false
  })
);

search.addWidget(
  instantsearch.widgets.sortBySelector({
    container: '#sort-by-selector',
    indices: [
      {name: 'per_posts_product', label: 'Featured'},
      {name: 'per_posts_product_price_asc', label: 'Price asc.'},
      {name: 'per_posts_product_price_desc', label: 'Price desc.'}
    ],
    label:'sort by'
  })
);

search.addWidget(
  instantsearch.widgets.clearAll({
    container: '#clear-all',
    templates: {
      link: '<i class="fa fa-times"></i> Clear all filters'
    },
    cssClasses: {
      root: 'btn btn-block btn-default'
    },
    autoHideContainer: true
  })
);

search.addWidget(
  instantsearch.widgets.hierarchicalMenu({
    container: '#categories',
    // limit: 5,
    attributes: [
      'taxonomies_hierarchical.product_cat.lvl0',
      'taxonomies_hierarchical.product_cat.lvl1',
      'taxonomies_hierarchical.product_cat.lvl2',
      'taxonomies_hierarchical.product_cat.lvl3'
    ],
    sortBy: ['name:asc'],
    templates: {
      item: menuTemplate
    },
    autoHideContainer: false,
    showParentLevel: true
  })
);

// start custom RefinementList

function renderFn(RefinementListRenderingOptions, isFirstRendering) {
    if (isFirstRendering) {
      RefinementListRenderingOptions.widgetParams.containerNode
        .html('<ul></ul>')
    }
 
      RefinementListRenderingOptions.widgetParams.containerNode
        .find('li[data-refine-value]')
        .each(function() { $(this).off('click'); });
 
    if (RefinementListRenderingOptions.canRefine) {
      var list = RefinementListRenderingOptions.items.map(function(item) {      
      for (var items_index = 0; items_index < RefinementListRenderingOptions.widgetParams.items.length; items_index++) {
        if (item.value == RefinementListRenderingOptions.widgetParams.items[items_index].value) {
          return `
            <li calss="refinement_check" data-refine-value="${item.value}">
              <input type="checkbox" value="${item.value}" ${item.isRefined ? 'checked' : ''} />
              <a href="${RefinementListRenderingOptions.createURL(item.value)}">
                ${RefinementListRenderingOptions.widgetParams.items[items_index].label} <span class="facet-count">(${item.count})</span>
              </a>
            </li>
          `;
        }
      }
    });

 
      RefinementListRenderingOptions.widgetParams.containerNode.find('ul').html(list);
      RefinementListRenderingOptions.widgetParams.containerNode
        .find('li[data-refine-value]')
        .each(function() {
          $(this).on('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
 
            RefinementListRenderingOptions.refine($(this).data('refine-value'));
          });
        });
    } else {
      RefinementListRenderingOptions.widgetParams.containerNode.find('ul').html('');
    }
  }
 
  // connect `renderFn` to RefinementList logic
  var customRefinementList = instantsearch.connectors.connectRefinementList(renderFn);
 
 
// End custom RefinementList

search.addWidget(
    customRefinementList({
    containerNode: jQuery( "#age" ),
    attributeName: 'taxonomies.product_tag',
    items: [
      { label: 'Age 1-10', value: 'age 1-10' },
      { label: 'Age 10-12', value: 'age 10-12' },
      { label: 'Age > 12', value: 'age >12' },
    ],
    sortBy: ['name:asc'],
    templates: {
      header: 'Age',
      item: facetTemplateCheckbox
    },
    autoHideContainer:false
  })
);


search.addWidget(
    customRefinementList({
    containerNode: jQuery( "#dignostic" ),
    attributeName: 'taxonomies.product_tag',
    items: [
      { label: 'Amputee', value: 'DX Amputee' },
      { label: 'CP', value: 'DX CP' },
      { label: 'SCI', value: 'DX SCI' },
    ],
    sortBy: ['name:asc'],
    templates: {
      header: 'Dignostic',
      item: facetTemplateCheckbox
    },
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#material',
    // limit: 3,
    attributeName: 'taxonomies.pa_mwc_material',
    sortBy: ['name:asc'], 
    templates: {
      header: 'Materials',
      item: facetTemplateCheckbox
    },
    collapsible: {
      collapsed: false,
    },
  })
);


search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#frm_style',
    // limit: 3,
    attributeName: 'taxonomies.pa_mwc_type',
    sortBy: ['name:asc'],
    templates: {
      header: 'Frame Style',
      item: facetTemplateCheckbox
    },
    collapsible: {
      collapsed: false,
    },
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#fld_type',
    // limit: 3,
    attributeName: 'taxonomies.pa_tube',
    sortBy: ['name:asc'],
    templates: {
      header: 'Tube Type',
      item: facetTemplateCheckbox
    },
    collapsible: {
      collapsed: false,
    },
  })
);

search.start();