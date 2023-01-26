// This widget definition will get combined into combined-widgets.js file along with all other widget definitions
// use of anonymous func ensures nothing here leaks into global scope
(function() {
  function twxmarkupcoe() {
    return {
      // Required, this will be used as the top level tag when it's dropped on the Canvas
      // use a custom prefix to so the name won't collide with other widgets
      elementTag: 'txw-markupCOE',

      // Text displayed for the widget in the Palette
      label: 'Markup COE',

      // category to assign the widget to, this value will be used by the
      // project definition to filter which widgets are valid for that type of project
      category: 'ar',

      // list of groups this widget will be included in the widget palette
      // standard value are Containers, Input, and Other
      groups : ["COE Extension"],
      
      // avoids showing this widget in Studio; when duplicating this template, remove or change to true
      isVisibleInPalette: true,

      // List of properties that will be displayed in the widget properties panel once it's been dropped on the Canvas
      properties: [
        {
          name: 'markup',
          label: 'Incoming Image URL',
          datatype: 'string',
          resource_url: true,
          default: '',
          isBindingTarget: true,
          isBindingSource: false,
          showInput: false
        },
        {
          name: 'markedup',
          label: 'Resulting Image URL',
          datatype: 'string',
          resource_url: true,
          default: '',
          isBindingTarget: false,
          isBindingSource: true,
          showInput: false
        },
        {
          name: 'markedupdata',
          label: 'Resulting Image Data',
          datatype: 'string',
          resource_url: false,
          default: '',
          isBindingTarget: false,
          isBindingSource: true,
          showInput: false
        },
        {
          name: 'includeborder',
          label: 'Include border',
          datatype: 'boolean',
          default: false,
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        },
        {
          name: 'includedatestamp',
          label: 'Include date stamp',
          datatype: 'boolean',
          default: false,
          isBindingTarget: true,
          isBindingSource: false,
          showInput: true
        }
      ],

      services: [
        {
          name: 'start',
          label: 'Start MarkUp'
        }

      ],

      // List of events that will displayed in the widget properties panel
      events: [
        {
          name: 'markStart',
          label: 'Markup started'
        },
        {
          name: 'markCompleted',
          label: 'Markup completed'
        },
        {
          name: 'markCancelled',
          label: 'Markup cancelled'
        }

      ],

      dependencies: {
        files         : ['js/markupCOE-ng.js','js/Markup.js', 'images/Markup_arrow.png', 'images/Markup_arrowSelected.png', 'images/Markup_blackspot.png', 'images/Markup_blackspotSelected.png', 'images/Markup_bluespot.png', 'images/Markup_bluespotSelected.png','images/Markup_redspot.png', 'images/Markup_redspotSelected.png','images/Markup_yellowspot.png', 'images/Markup_yellowspotSelected.png','images/Markup_marker.png', 'images/Markup_markerSelected.png','images/Markup_reset.png', 'images/Markup_save.png' ,'images/Markup_cancel.png'],
        angularModules: ['markupcoe-ng']
      },

      // HTML to render when the widget is dropped on the Canvas
      designTemplate: function () {
        return '<div class="markupcoeWidget"></div>';
      },

      runtimeTemplate: function (props) {
        var tmpl = '<div ng-markupcoe  markup-field={{me.markup}} markedup-field="me.markedup" markedupdata-field="me.markedupdata" includeborder-field={{me.includeborder}} includedatestamp-field={{me.includedatestamp}} ></div>' ; //original-field="me.original" markedup-field="me.markedup" delegate-field="delegate"></div>';
        return tmpl;
      }
    };
  }

  // registers the widget in Studio so that it gets displayed in the Widget Palette, it will only show up in the
  // Widget Palette for views that this widget is registered for (as determined by category property)
  twxAppBuilder.widget('twxmarkupcoe', twxmarkupcoe);

}());
