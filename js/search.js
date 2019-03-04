'use strict';
/* global instantsearch */

var search = instantsearch({
  appId: 'HQ2JTF16MK',
  apiKey: '678094efc0f2a1927f601e42ab17f244',
  indexName: 'per_posts_product',

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
  '<article class="hit">' +
      '<div class="product-picture-wrapper">' +
        '<div class="product-picture"><img src="{{images.thumbnail.url}}" /></div>' +
      '</div>' +
      '<div class="product-desc-wrapper">' +
        '<a href="{{{permalink}}}" class="product-name">{{{_highlightResult.post_title.value}}}</a>' +
        '<div class="product-type">{{{_highlightResult.content.value}}}</div>' +
      '</div>' +
  '</article>';

var noResultsTemplate =
  '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>';

var menuTemplate =
  '<a href="javascript:void(0);" class="facet-item {{#isRefined}}active{{/isRefined}}"><span class="facet-name"><i class="fa fa-angle-right"></i> {{label}}</span class="facet-name"></a>';

var facetTemplateCheckbox =
  '<a href="javascript:void(0);" class="facet-item">' +
    '<input type="checkbox" class="{{cssClasses.checkbox}}" value="{{label}}" {{#isRefined}}checked{{/isRefined}} />{{label}}' +
    '<span class="facet-count">({{count}})</span>' +
  '</a>';

var facetTemplateColors =
  '<a href="javascript:void(0);" data-facet-value="{{label}}" class="facet-color {{#isRefined}}checked{{/isRefined}}"></a>';



search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    hitsPerPage: 4,
    templates: {
      empty: noResultsTemplate,
      item: hitTemplate
    },
    transformData: function(hit) {
      hit.stars = [];
      for (var i = 1; i <= 5; ++i) {
        hit.stars.push(i <= hit.rating);
      }
      return hit;
    }
  })
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
  instantsearch.widgets.hierarchicalMenu({
    container: '#categories',
    limit: 3,
    attributes: [
      'taxonomies_hierarchical.product_cat.lvl0'
    ],
    sortBy: ['name:asc'],
    templates: {
      item: menuTemplate
    }
  })
);

search.start();