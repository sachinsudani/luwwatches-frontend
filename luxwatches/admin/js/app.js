// Angular Code

(function () {
    'use strict'
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl)
    })
})()

angular.module("myApp", ["ngRoute"])
// Angular Rendering Options
.directive('onFinishRender', function($timeout) {
  return {
    link: function ($scope, element, attr) {
      if($scope.$last == true) {
        $timeout(function () {
          $scope.$emit('ngRepeatFinished');
        })
      }
    }
  }
})

// Angular Route Controller
.config(function($routeProvider) {
  $routeProvider
      .when("/product", {
        templateUrl: "view/product.html",
        controller: "productController",
        resolve: "productController.resolve"
      }).when("/", {
        templateUrl: "view/customer.html",
        controller: "customerController",
        resolve: "customerController.resolve"
      }).when("/order", {
        templateUrl: "view/order.html",
        controller: "orderController"
      })
      .otherwise({redierectTo: "/"})
})

// Product Controller
  .controller("productController",['$scope', '$http', '$location', '$anchorScroll', function ($scope, $http, $location, $anchorScroll) {
    // Get Data From Request And Bind it to Controller
    $http.get("http://localhost:3000/luxwatchesapi/public/product.php?limit=9").then(function (response) {
      $scope.products = response.data;
      console.log(response);
      console.log("helo");
    }, function (error) {
      console.log(error)
    });

    this.productNavbarAnimate = productNavbarAnimate()
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      productDisplay($scope, $http)
    })

    $scope.scrollTo = function(id) {
      let old = $location.hash();
      $location.hash(id);
      $anchorScroll();
      $location.hash(old);
      console.log(id)
    }

    const header = document.querySelector("#header")
    header.childNodes[1].childNodes[1].childNodes[1].innerHTML = "Products"

    const navbar = document.querySelector("#navbarElement")
    navbar.childNodes[1].innerHTML = "ALL PRODUCTS"
  }])

// Single Product Controller
  .controller("singleProductController", ['$scope', '$http', function($scope, $http) {
    $http.get("http://localhost:3000/luxwatchesapi/public/product.php/").then(function (response) {
      $scope.product = response.data[0];
      console.log(response.data);
      console.log("helo");
    }, function (error) {
      console.log(error)
    });
  }])
  
  
  .controller("customerController", ['$scope', '$http', function($scope, $http) {
    $http.get("http://localhost:3000/luxwatchesapi/public/user.php/all").then(function (response) {
      $scope.customers = response.data;
    }, function (error) {
      console.log(error)
    });

    const header = document.querySelector("#header")
    header.childNodes[1].childNodes[1].childNodes[1].innerHTML = "All Customers"

    const navbar = document.querySelector("#navbarElement")
    navbar.childNodes[1].innerHTML = "ALL CUSTOMERS"

  }])

// Order Controller 
  .controller("orderController", ['$scope', '$http', function($scope, $http) {
    $http.get("http://localhost:3000/luxwatchesapi/public/cart.php/all").then(function (response) {
      $scope.orders = response.data;
    }, function (error) {
      console.log(error)
    });

    const header = document.querySelector("#header")
    header.childNodes[1].childNodes[1].childNodes[1].innerHTML = "All Orders"

    const navbar = document.querySelector("#navbarElement")
    navbar.childNodes[1].innerHTML = "ALL ORDERS"
  }])

// Product Navbar Animation
function productNavbarAnimate() {
  productNavbar(".productNav")
  productNavbar(".productDetailsNav")
}

function productNavbar(product) {
  const navbar = product;
  const productNav = document.querySelectorAll(navbar);
  console.log(product)
  productNav.forEach((element) => {
    element.childNodes[1].childNodes.forEach((activeList) => {
      if(activeList/2 != 0) {
          activeList.addEventListener("click", (event) => {
              if(activeList.childNodes[1] === undefined) {
                activeList.childNodes[0].classList.add("nav-active")
              } else {
                activeList.childNodes[1].classList.add("nav-active")
              }
              document.querySelectorAll(`${navbar} li a`).forEach((list) => {
                if(activeList.childNodes[1] != list) {
                  if(!(activeList.childNodes[0] == list)){
                    list.classList.remove("nav-active")
                  }
                }
              })
          })
      }
  })
  })
}

// Product Display 
function productDisplay(scope, http) {
  const products = document.querySelector("#productTable");
  const stocks = document.querySelectorAll(".stock");

  products.childNodes.forEach((product, index) => {
    if(index != 1){
      product.addEventListener("click", () => {
        
        //$scope.singleProduct = getSingleProduct(product.id);
        const id = product.childNodes[1].innerHTML;
        getSingleProduct(id, http, scope);
        // Header Section
        const header = document.querySelector("#header")
        // Product Table 
        const table = document.querySelector(".table").setAttribute("style", "display: none")
        // Edit Section
        const edit = document.querySelector("#edit")
        document.querySelector("#product-nav").setAttribute("style", "display: none")
        document.querySelector("#product-details").setAttribute("style", "dispaly: block; height: 1.80rem;")

        header.childNodes[1].childNodes[1].childNodes[1].innerHTML = "<svg class='bi me-0' style='fill: var(--bs-indigo); width:40px; height:40px'><use xlink:href='#back'/></svg><span>" + product.childNodes[5].innerHTML + "</span>"
        tabFixes("product-details")
        
        console.log(header.childNodes[1].childNodes[1].childNodes)
        header.childNodes[1].childNodes[1].childNodes[1].addEventListener("click", (e) => {
          document.querySelector("#product-nav").setAttribute("style", "display: block; height: 1.80rem;")
          document.querySelector("#product-details").setAttribute("style", "display: none")
          document.querySelector(".table").setAttribute("style", "display: table")
          header.childNodes[1].childNodes[1].childNodes[1].innerHTML = "Products"
          tabFixes("product-nav")
        })
        
        productNavbarAnimate()

        const addcompany = document.querySelector('#addCompany');
        const company = document.querySelectorAll("#company");
        const companyForm = document.querySelector("#companyForm");
        addcompany.addEventListener("click", (e) => {
          if(addcompany.innerHTML == "Add Company") {
            companyForm.setAttribute("style", "display: block")
            addcompany.innerHTML = "Save";
          } else {
            companyForm.setAttribute("style", "display: none")
            addcompany.innerHTML = "Add Company";
          }
        })

        const addcategory = document.querySelector('#addCategory');
        const categoryForm = document.querySelector("#categoryForm");
        addcategory.addEventListener("click", (e) => {
          if(addcategory.innerHTML == "Add Category") {
            categoryForm.setAttribute("style", "display: block")
            addcategory.innerHTML = "Save";
          } else {
            categoryForm.setAttribute("style", "display: none")
            addcategory.innerHTML = "Add Category";
          }
        })

        const addImage = document.querySelector("#addImage");
        addImage.addEventListener("click", (e) => {
          document.querySelector("#addProductImages").click();
        });

        const deleteProduct = document.querySelector("#deleteProduct");
        deleteProduct.addEventListener("click", (e) => {
          
        });
        
      })
    }
  })

  stocks.forEach((stock) => {
    const number = parseInt(stock.children.item(0).innerHTML);
    if(number > -1 && number < 10) {
      stock.children.item(0).classList.add('out-of-stock')
    } else if(number > 9 && number < 30) {
      stock.children.item(0).classList.add('medium-stock')
    } else {
      stock.children.item(0).classList.add('in-stock')
    }
    console.log(stock.children.item(0))
  })
}

function tabFixes(productNav) {
  
  document.querySelector("#myTabContent").childNodes.forEach((element) => {
    if(!(element.attributes === undefined)) {
      if(element.classList.contains("show") && element.classList.contains("active")) {
        element.classList.remove("active")
        element.classList.remove("show")
      }
    }
  })

  document.querySelectorAll(`#${productNav} li a`).forEach((element) => {
    if(element.classList.contains("nav-active")) {
      const tabname = element.attributes.getNamedItem("aria-controls").value
      const tab = document.querySelector(`#${tabname}`)
      tab.classList.add("active")
      tab.classList.add("show")
    }
  })
  
}

function getSingleProduct(id, $http, $scope) {
  console.log(id)
  console.log($http)
  $http.get("http://localhost:3000/luxwatchesapi/public/product.php/" + id).then(function (response) {
    $scope.singleProduct = response.data
    console.log(response.data)
  }, function (error) {
    console.log(error)
  });
}