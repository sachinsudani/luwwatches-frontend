const cartCount = document.querySelector(".count-number");
cartCount.innerHTML = "0";
const app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "view/home.html",
            controller: "homeController"
        })
        .when("/shop", {
            templateUrl: "view/shop.html",
            controller: "shopController"
        })
        .when("/contact", {
            templateUrl: "view/contact.html"
        })
        .when("/user", {
            templateUrl: "view/user.html",
            controller: "userController"
        })
        .when("/user/register", {
            templateUrl: "view/register.html",
            controller: "registerController"
        })
        .when("/user/login", {
            templateUrl: "view/login.html",
            controller: "loginController"
        })
        .when("/cart", {
            templateUrl: "view/cart.html",
            controller: "cartController"
        })
        .when("/product/:id", {
            templateUrl: "view/product.html",
            controller: "singleProductController"
        })
        .when("/category/:id", {
            templateUrl: "view/category.html",
            controller: "categoryController"
        })
        .when("/add/:id", {
            templateUrl: "view/cart.html",
            controller: "addToCartController"
        })
        .when("/checkout", {
            templateUrl: "view/checkout.html",
            controller: "checkoutController"
        })
        .otherwise({redierectTo: "/"});
});

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);

app.controller("homeController", ["$http", "$scope", function($http, $scope) {
    $http({
        method: "GET",
        url: "http://localhost:3000/luxwatchesapi/public/product.php?limit=3",
    }).then(function(result) {
        $scope.products = result.data;
    }, function(error) {
        console.log(error)
    });

    $http({
        method: "GET",
        url: "http://localhost:3000/luxwatchesapi/public/category.php",
    }).then(function(result) {
        $scope.categories = result.data;
    }, function(error) {
        console.log(error)
    });

    const cartCount = document.querySelector(".count-number");
    cartCount.innerHTML = "0";
}])

app.controller("shopController", ["$http", "$scope", function($http, $scope) {
    $http({
        method: "GET",
        url: "http://localhost:3000/luxwatchesapi/public/product.php?limit=9",
    }).then(function(result) {
        $scope.products = result.data;
        console.log(result.data);
    }, function(error) {
        console.log(error)
    });

    $scope.checkIndex = function(product) {
        console.log(product)
        return product.id / 3 == 0;
    }
}])

app.controller("singleProductController", ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {
    let categoryID = 0;
    $http({
        method: "GET",
        url: "http://localhost:3000/luxwatchesapi/public/product.php/"+$routeParams.id
    }).then(function(result) {
        $scope.product = result.data;
        categoryID = result.data.CATEGORY["ID"];

        $http({
            method: "GET",
            url: "http://localhost:3000/luxwatchesapi/public/product.php/category/"+ result.data.CATEGORY["ID"]
        }).then(function(result) {
            $scope.related = result.data;
            for(let i=0;i<result.data.length;i++) {
                $scope.related.pop();
            }
            $scope.related.pop();
            console.log($scope.related)
        }, function(error) {
            console.log(error);
        })        

    }, function(error) {
        console.log(error);
    })
}])

app.controller("categoryController", ["$http", "$scope", '$routeParams', function($http, $scope, $routeParams) {
    $http({
        method: "GET",
        url: "http://localhost:3000/luxwatchesapi/public/product.php/category/"+$routeParams.id,
    }).then(function(result) {
        $scope.products = result.data;
    }, function(error) {
        console.log(error)
    });

    $http({
        method: "GET",
        url: "http://localhost:3000/luxwatchesapi/public/category.php/"+$routeParams.id,
    }).then(function(result) {
        $scope.category = result.data[0];
        console.log($scope.category)
    }, function(error) {
        console.log(error)
    });
}])

app.controller("loginController", ["$http", "$scope", "$routeParams", function($http, $scope, $routeParams) {
    const login = document.querySelector("#login");
    
    $http({
        method: "GET",
        url: "http://localhost:3000/luxwatchesapi/public/user.php",
    }).then(function(success) {
        window.location.href = "#!/";
    }, function(error) {
        console.log(error)
    })

    login.addEventListener("click", (e) => {
        const alert  = document.querySelector(".alert-container");
        const user = $scope.user;
        $http({
            method: "POST",
            url: "http://localhost:3000/luxwatchesapi/public/user.php/login",
            data: JSON.stringify(user),
            headers: {'Content-Type': 'application/json'}
        }).then(function(result) {
            console.log(result.data["ROLES"])
            if(result.data["ROLES"] == "user")
                window.location.href = "#!/";
            else
                window.location.href = "./admin/"
        }, function(error) {
            console.log(error);
            alert.childNodes[1].innerHTML = "Could Not Login, Please try again";
            alert.classList.add("active-alert");
            setTimeout(function() {
                alert.classList.remove("active-alert");
            }, 5000);
        });
    })
    
}])

app.controller("userController", ["$http", "$scope", "$routeParams", function($http, $scope, $routeParams) {
    // const login = document.querySelector("#login");
    $http({
        method: "GET",
        url: "http://localhost:3000/luxwatchesapi/public/user.php"
    }).then(function(result) {
        $scope.user = lowercaseKeys(result.data["profile"]);
        $scope.userAddress = lowercaseKeys(result.data["address"]);
        console.log(lowercaseKeys(result.data["profile"]))
    },function(error) {
        console.log(error)
        window.location.href = "#!user/login";
    })

    const logout = document.querySelector("#logout");
    logout.addEventListener("click", (e) => {
        $http({
            method: "POST",
            url: "http://localhost:3000/luxwatchesapi/public/user.php/logout"
        }).then(function(result) {
            window.location.href = "#!/";
        },function(error) {
            console.log(error)
            window.location.href = "#!user/login";
        })  
    })

    const updateProfile = document.querySelector("#updateProfile")
    updateProfile.addEventListener("click", (e) => {
        $http({
            method: "UPDATE",
            url: "http://localhost:3000/luxwatchesapi/public/user.php",
            data: $scope.user
        }).then(function(result) {
            window.location.href = "#!/";
        },function(error) {
            console.log(error)
            window.location.href = "#!user/login";
        })
    })
}])

app.controller("registerController", ["$http", "$scope", "$routeParams", function($http, $scope, $routeParams) {
    const register = document.querySelector("#register");

    register.addEventListener("click", (e) => {
        const alert  = document.querySelector(".alert-container");
        const user = $scope.user;
        console.log(user);

        $http({
            method: "POST",
            url: "http://localhost:3000/luxwatchesapi/public/user.php",
            data: JSON.stringify(user),
            headers: {'Content-Type': 'application/json'}
        }).then(function(result) {
            window.location.href = "#!/";
        }, function(error) {
            console.log(error);
            alert.childNodes[1].innerHTML = "Could Not Login, Please try again";
            alert.classList.add("active-alert");
            setTimeout(function() {
                alert.classList.remove("active-alert");
            }, 5000);
        });
    })
}])

app.controller("cartController", ["$http", "$scope", "$routeParams", function($http, $scope, $routeParams) {
    $http({
        url: "http://localhost:3000/luxwatchesapi/public/cart.php",
        method: "GET",
    })
    .then(function(result) {
        if(result.data.length == 0) {
            document.querySelector("#cart-empty").setAttribute("style", "display: block");
            document.querySelector("#cart").setAttribute("style", "display: none");
        } else {
            document.querySelector("#cart-empty").setAttribute("style", "display: none");
            document.querySelector("#cart").setAttribute("style", "display: block");
            $scope.orderedProducts = result.data["ORDEREDPRODUCTS"];
            $scope.totalprice = result.data["TOTALPRICE"][0];
        }
        // window.location.href = "#!/";
    }, function(error) {
        if(error.status == 401) {
            window.location.href = "#!/user";
        }
    });
}])

app.controller("checkoutController", ["$http", "$scope", function($http, $scope) {
    $http({
        url: "http://localhost:3000/luxwatchesapi/public/cart.php",
        method: "GET",
    })
    .then(function(result) {
        $scope.orderProducts = result.data["ORDEREDPRODUCTS"];
        $scope.total = result.data["TOTALPRICE"][0];
        console.log(result)
    }, function(error) {
        if(error.status == 401) {
            window.location.href = "#!/user";
        }
    });
}])

app.controller("addToCartController", ["$http", "$scope", "$routeParams", function($http, $scope, $routeParams) {
    $http({
        url: "http://localhost:3000/luxwatchesapi/public/cart.php?quantity=1&id=" + $routeParams.id,
        method: "POST",
    })
    .then(function(result) {
       window.location.href = "#!cart";
    }, function(error) {
        console.log(error);
    });
}])

const lowercaseKeys = obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase()] = obj[key];
    return acc;
  }, {});


const placeOrder = () => {
    const response = fetch('http://localhost:3000/luxwatchesapi/public/cart.php/order', {
        method: 'UPDATE',
        mode: 'cors',
        credentials: 'same-origin'
    }).then((response) => {
        if(response.status == "201") {
            window.location.href = "#!/"
        }
    })
}