'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">its-gateway documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-1cf1064dc88b31202400a0da77820a95635ec2b35ab51b302cae3520e179e849c44ec542c6105d9adcafcb24be6c2cf79fbd8ee5262e78be299af89e632c759f"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-1cf1064dc88b31202400a0da77820a95635ec2b35ab51b302cae3520e179e849c44ec542c6105d9adcafcb24be6c2cf79fbd8ee5262e78be299af89e632c759f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-1cf1064dc88b31202400a0da77820a95635ec2b35ab51b302cae3520e179e849c44ec542c6105d9adcafcb24be6c2cf79fbd8ee5262e78be299af89e632c759f"' :
                                            'id="xs-controllers-links-module-AuthModule-1cf1064dc88b31202400a0da77820a95635ec2b35ab51b302cae3520e179e849c44ec542c6105d9adcafcb24be6c2cf79fbd8ee5262e78be299af89e632c759f"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-1cf1064dc88b31202400a0da77820a95635ec2b35ab51b302cae3520e179e849c44ec542c6105d9adcafcb24be6c2cf79fbd8ee5262e78be299af89e632c759f"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-1cf1064dc88b31202400a0da77820a95635ec2b35ab51b302cae3520e179e849c44ec542c6105d9adcafcb24be6c2cf79fbd8ee5262e78be299af89e632c759f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-1cf1064dc88b31202400a0da77820a95635ec2b35ab51b302cae3520e179e849c44ec542c6105d9adcafcb24be6c2cf79fbd8ee5262e78be299af89e632c759f"' :
                                        'id="xs-injectables-links-module-AuthModule-1cf1064dc88b31202400a0da77820a95635ec2b35ab51b302cae3520e179e849c44ec542c6105d9adcafcb24be6c2cf79fbd8ee5262e78be299af89e632c759f"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CartModule.html" data-type="entity-link" >CartModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CartModule-b4d6dca68cc3baba08d9929e82e2b8db5fd9aab44b5c06bf5d4104fd2a46c412f498c705347d170ac1b80d60565e4fbd31e9200878be79fbd79b6f99d7153e85"' : 'data-bs-target="#xs-controllers-links-module-CartModule-b4d6dca68cc3baba08d9929e82e2b8db5fd9aab44b5c06bf5d4104fd2a46c412f498c705347d170ac1b80d60565e4fbd31e9200878be79fbd79b6f99d7153e85"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CartModule-b4d6dca68cc3baba08d9929e82e2b8db5fd9aab44b5c06bf5d4104fd2a46c412f498c705347d170ac1b80d60565e4fbd31e9200878be79fbd79b6f99d7153e85"' :
                                            'id="xs-controllers-links-module-CartModule-b4d6dca68cc3baba08d9929e82e2b8db5fd9aab44b5c06bf5d4104fd2a46c412f498c705347d170ac1b80d60565e4fbd31e9200878be79fbd79b6f99d7153e85"' }>
                                            <li class="link">
                                                <a href="controllers/CartController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InvoiceModule.html" data-type="entity-link" >InvoiceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-InvoiceModule-9a261909a786e2522c3bf0e2e5cad507bfe0026d0f8affbd3480ec4999b1077a330722c6eca04af27d5570d1c6fd374c9d034ac0141f58715ba381384de69e94"' : 'data-bs-target="#xs-controllers-links-module-InvoiceModule-9a261909a786e2522c3bf0e2e5cad507bfe0026d0f8affbd3480ec4999b1077a330722c6eca04af27d5570d1c6fd374c9d034ac0141f58715ba381384de69e94"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-InvoiceModule-9a261909a786e2522c3bf0e2e5cad507bfe0026d0f8affbd3480ec4999b1077a330722c6eca04af27d5570d1c6fd374c9d034ac0141f58715ba381384de69e94"' :
                                            'id="xs-controllers-links-module-InvoiceModule-9a261909a786e2522c3bf0e2e5cad507bfe0026d0f8affbd3480ec4999b1077a330722c6eca04af27d5570d1c6fd374c9d034ac0141f58715ba381384de69e94"' }>
                                            <li class="link">
                                                <a href="controllers/InvoiceController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InvoiceController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductModule.html" data-type="entity-link" >ProductModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProductModule-e22b2cb89bad17f4cbf8a21aab753fc22ce6dc12d9385fcebfcfb3c66cf587d359b31980cfb6dd36d73bda39dbc503d3e1d939f037a8a6d20d6797af586f297f"' : 'data-bs-target="#xs-controllers-links-module-ProductModule-e22b2cb89bad17f4cbf8a21aab753fc22ce6dc12d9385fcebfcfb3c66cf587d359b31980cfb6dd36d73bda39dbc503d3e1d939f037a8a6d20d6797af586f297f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProductModule-e22b2cb89bad17f4cbf8a21aab753fc22ce6dc12d9385fcebfcfb3c66cf587d359b31980cfb6dd36d73bda39dbc503d3e1d939f037a8a6d20d6797af586f297f"' :
                                            'id="xs-controllers-links-module-ProductModule-e22b2cb89bad17f4cbf8a21aab753fc22ce6dc12d9385fcebfcfb3c66cf587d359b31980cfb6dd36d73bda39dbc503d3e1d939f037a8a6d20d6797af586f297f"' }>
                                            <li class="link">
                                                <a href="controllers/ProductController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-6d27241f609a51e5ec0e92af273b3789799376dd578e541ef8787de909621e089c233898eaafaa6e0a8e5da175eca6de5e59aba64e4ce2cc0d0480b6f307f668"' : 'data-bs-target="#xs-controllers-links-module-UserModule-6d27241f609a51e5ec0e92af273b3789799376dd578e541ef8787de909621e089c233898eaafaa6e0a8e5da175eca6de5e59aba64e4ce2cc0d0480b6f307f668"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-6d27241f609a51e5ec0e92af273b3789799376dd578e541ef8787de909621e089c233898eaafaa6e0a8e5da175eca6de5e59aba64e4ce2cc0d0480b6f307f668"' :
                                            'id="xs-controllers-links-module-UserModule-6d27241f609a51e5ec0e92af273b3789799376dd578e541ef8787de909621e089c233898eaafaa6e0a8e5da175eca6de5e59aba64e4ce2cc0d0480b6f307f668"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CartController.html" data-type="entity-link" >CartController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/InvoiceController.html" data-type="entity-link" >InvoiceController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProductController.html" data-type="entity-link" >ProductController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddProductDto.html" data-type="entity-link" >AddProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Auth.html" data-type="entity-link" >Auth</a>
                            </li>
                            <li class="link">
                                <a href="classes/Cart.html" data-type="entity-link" >Cart</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAuthDto.html" data-type="entity-link" >CreateAuthDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateInvoiceDto.html" data-type="entity-link" >CreateInvoiceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductDto.html" data-type="entity-link" >CreateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Invoice.html" data-type="entity-link" >Invoice</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvoiceProductDto.html" data-type="entity-link" >InvoiceProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Product.html" data-type="entity-link" >Product</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductResponseDto.html" data-type="entity-link" >ProductResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveProductDto.html" data-type="entity-link" >RemoveProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAuthDto.html" data-type="entity-link" >UpdateAuthDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateInvoiceDto.html" data-type="entity-link" >UpdateInvoiceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProductDto.html" data-type="entity-link" >UpdateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/JwtGuard.html" data-type="entity-link" >JwtGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/EnvVars.html" data-type="entity-link" >EnvVars</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PayloadInterface.html" data-type="entity-link" >PayloadInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RpcResponse.html" data-type="entity-link" >RpcResponse</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});