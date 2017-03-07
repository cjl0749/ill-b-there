(function() {

var AppHeaderComponent = {};

AppHeaderComponent.view = function () {
  return [
    m('header.app-header', [
      m('h1.app-title', 'I\'ll B There')
    ])
  ]
};

var AppComponent = {};

AppComponent.view = function () {
  return [
    m(AppHeaderComponent),
    m(SignInComponent)
  ];
};

window.AppComponent = AppComponent;
}());
