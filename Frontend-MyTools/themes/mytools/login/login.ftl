<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    
    <#if section = "header">
        ${msg("loginTitle",(realm.displayName!''))}

    <#elseif section = "form">

    <div class="mytools-card">

        <!-- ── Brand ─────────────────────────────── -->
        <div class="mytools-brand">
            <div class="mytools-logo">🔧</div>
            <h1 class="mytools-title">My-Tools</h1>
            <p class="mytools-subtitle">
                <#if realm.password && social.providers??>
                    Sign in to your account
                <#else>
                    Welcome back, craftsman
                </#if>
            </p>
        </div>

        <!-- ── Flash messages ─────────────────────── -->
        <#if message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
            <div class="mytools-alert mytools-alert-${message.type}">
                <#if message.type = 'success'><span class="alert-icon">✅</span></#if>
                <#if message.type = 'error'>  <span class="alert-icon">⚠️</span></#if>
                <#if message.type = 'warning'><span class="alert-icon">⚡</span></#if>
                <#if message.type = 'info'>   <span class="alert-icon">ℹ️</span></#if>
                <span class="alert-text">${kcSanitize(message.summary)?no_esc}</span>
            </div>
        </#if>

        <!-- ── Social / Identity Providers ───────── -->
        <#if realm.password && social.providers??>
            <div class="mytools-social">
                <#list social.providers as p>
                    <a href="${p.loginUrl}" class="mytools-social-btn">
                        <#if p.iconClasses?has_content>
                            <i class="${p.iconClasses}" aria-hidden="true"></i>
                        </#if>
                        <span>Continue with ${p.displayName!}</span>
                    </a>
                </#list>
            </div>
            <#if realm.password>
                <div class="mytools-divider">
                    <span>or sign in with email</span>
                </div>
            </#if>
        </#if>

        <!-- ── Login Form ──────────────────────────── -->
        <#if realm.password>
            <form id="kc-form-login" class="mytools-form"
                  action="${url.loginAction}" method="post">

                <!-- Username / Email -->
                <div class="mytools-field">
                    <label for="username" class="mytools-label">
                        <#if !realm.loginWithEmailAllowed>
                            ${msg("username")}
                        <#elseif !realm.registrationEmailAsUsername>
                            ${msg("usernameOrEmail")}
                        <#else>
                            ${msg("email")}
                        </#if>
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        class="mytools-input <#if messagesPerField.existsError('username','password')>mytools-input-error</#if>"
                        value="${(login.username!'')}"
                        autofocus
                        autocomplete="username"
                        placeholder="<#if !realm.loginWithEmailAllowed>Username<#elseif !realm.registrationEmailAsUsername>Email or username<#else>Email address</#if>"
                    />
                    <#if messagesPerField.existsError('username')>
                        <span class="mytools-field-error">${kcSanitize(messagesPerField.get('username'))?no_esc}</span>
                    </#if>
                </div>

                <!-- Password -->
                <div class="mytools-field">
                    <div class="mytools-label-row">
                        <label for="password" class="mytools-label">${msg("password")}</label>
                        <#if realm.resetPasswordAllowed>
                            <a href="${url.loginResetCredentialsUrl}" class="mytools-forgot-link">
                                ${msg("doForgotPassword")}
                            </a>
                        </#if>
                    </div>
                    <div class="mytools-password-wrap">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            class="mytools-input mytools-input-password <#if messagesPerField.existsError('username','password')>mytools-input-error</#if>"
                            autocomplete="current-password"
                            placeholder="••••••••••"
                        />
                        <button
                            type="button"
                            class="mytools-eye-btn"
                            onclick="togglePassword()"
                            aria-label="Toggle password visibility">
                            <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                    </div>
                    <#if messagesPerField.existsError('password')>
                        <span class="mytools-field-error">${kcSanitize(messagesPerField.get('password'))?no_esc}</span>
                    </#if>
                </div>

                <!-- Remember me -->
                <#if realm.rememberMe && !usernameEditDisabled??>
                    <div class="mytools-remember">
                        <label class="mytools-checkbox-label">
                            <input id="rememberMe" name="rememberMe" type="checkbox"
                                   class="mytools-checkbox"
                                   <#if login.rememberMe??>checked</#if> />
                            <span class="mytools-checkbox-text">${msg("rememberMe")}</span>
                        </label>
                    </div>
                </#if>

                <!-- Submit -->
                <input
                    type="hidden"
                    id="id-hidden-input"
                    name="credentialId"
                    <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>
                />
                <button type="submit" class="mytools-btn-primary" name="login">
                    ${msg("doLogIn")}
                </button>

            </form>
        </#if>

        <!-- ── Register link ───────────────────────── -->
        <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
            <div class="mytools-register">
                <span>${msg("noAccount")}</span>
                <a href="${url.registrationUrl}" class="mytools-register-link">
                    ${msg("doRegister")}
                </a>
            </div>
        </#if>

    </div><!-- /.mytools-card -->

    <!-- ── Password toggle script ─────────────────── -->
    <script>
        function togglePassword() {
            var input = document.getElementById('password');
            var icon  = document.getElementById('eye-icon');
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                `;
            } else {
                input.type = 'password';
                icon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                `;
            }
        }
    </script>

    </#if><!-- end form section -->

</@layout.registrationLayout>
