<template>
    <footer>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-sm">
                    Copyright © 2018 <a href="https://tokenary.io?utm_source=tokenary_app&utm_medium=link&utm_campaign=web">Tokenary</a>
                </div>
                <div class="col-sm text-right">
                    <ul class="links">
                        <li>
                            <a target="_blank" href="https://tokenary.io/terms-of-service/?utm_source=tokenary_app&utm_medium=linkto&utm_campaign=web">
                                Terms of Service</a>
                        </li>
                        <li>
                            <a target="_blank" href="https://tokenary.io/privacy-policy/?utm_source=tokenary_app&utm_medium=link&utm_campaign=web">
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a target="_blank" href="https://github.com/Tokenary">
                                Source Code
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</template>
<script>

export default {
  name: 'bottom'
}
</script>

<style lang="scss" scoped>

    footer {
        background: white;
        margin-top: 40px;
        padding: 10px 0;
        border-top: 1px solid rgba(0, 0, 0, .0975);
    }

    .links {
        list-style: none;
        margin-bottom: 0;

        li {
            display: inline-block;
            padding: 0 10px;
            position: relative;

            &:after {
                content: "";
                display: inline-block;
                vertical-align: middle;
                height: 15px;
                width: 1px;
                background: black;
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                color: #5f6368;
            }

            a {
                color: #5f6368;
            }

            &:last-of-type {
                &:after {
                    content: none;
                }
            }
        }
    }
</style>
