<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
    <div class="tx-direction" v-if="address != null">
        {{ $t(label) }}:
        <span @mouseover="mouseOver"
              @mouseleave="mouseLeave"
              v-tooltip="{
                            content: this.copied ? $t('clipboard_button_copied') : address,
                            hideOnTargetClick: false,
                            show: isShow,
                            trigger: 'manual',
                            delay: { show: 500, hide: 100 }
                        }"
              v-clipboard:success="onCopy"
              v-clipboard:copy="address">
            {{ address.substr(2, 4) + '&#8230;' + address.slice(-4)}}
        </span>
    </div>
</template>

<script>
export default {
  name: 'tx-direction',
  props: ['label', 'address'],
  methods: {
    onCopy () {
      this.copied = true
    },
    async mouseLeave () {
      this.isShow = false
      setTimeout(() => {
        this.copied = false
      }, 200)
    },
    mouseOver () {
      this.isShow = true
    }
  },
  data () {
    return {
      copied: false,
      isShow: false
    }
  }
}
</script>

<i18n>
    {
        "en": {
            "from": "from",
            "to": "to",
            "self": "self",
            "clipboard_button_copied": "Copied!"
        },
        "ru": {
            "from": "от",
            "to": "на",
            "self": "себе",
            "clipboard_button_copied": "Скопировано"
        }
    }
</i18n>

<style lang="scss">

    .icon {
        max-width: 25px;
        max-height: 25px;
        border-radius: 25%;
        object-fit: contain;
        cursor: pointer;
    }

    .tx-direction {
        color: $darkGrey;
    }

    .tooltip {
        display: block !important;
        z-index: 99999;

        .tooltip-inner {
            background: black;
            color: white;
            border-radius: 16px;
            padding: 5px 10px 4px;
        }

        .tooltip-arrow {
            width: 0;
            height: 0;
            border-style: solid;
            position: absolute;
            margin: 5px;
            border-color: black;
            z-index: 1;
        }

        &[x-placement^="top"] {
            margin-bottom: 5px;

            .tooltip-arrow {
                border-width: 5px 5px 0 5px;
                border-left-color: transparent !important;
                border-right-color: transparent !important;
                border-bottom-color: transparent !important;
                bottom: -5px;
                left: calc(50% - 5px);
                margin-top: 0;
                margin-bottom: 0;
            }
        }

        &[x-placement^="bottom"] {
            margin-top: 5px;

            .tooltip-arrow {
                border-width: 0 5px 5px 5px;
                border-left-color: transparent !important;
                border-right-color: transparent !important;
                border-top-color: transparent !important;
                top: -5px;
                left: calc(50% - 5px);
                margin-top: 0;
                margin-bottom: 0;
            }
        }

        &[x-placement^="right"] {
            margin-left: 5px;

            .tooltip-arrow {
                border-width: 5px 5px 5px 0;
                border-left-color: transparent !important;
                border-top-color: transparent !important;
                border-bottom-color: transparent !important;
                left: -5px;
                top: calc(50% - 5px);
                margin-left: 0;
                margin-right: 0;
            }
        }

        &[x-placement^="left"] {
            margin-right: 5px;

            .tooltip-arrow {
                border-width: 5px 0 5px 5px;
                border-top-color: transparent !important;
                border-right-color: transparent !important;
                border-bottom-color: transparent !important;
                right: -5px;
                top: calc(50% - 5px);
                margin-left: 0;
                margin-right: 0;
            }
        }

        &.popover {
            $color: #f9f9f9;

            .popover-inner {
                background: $color;
                color: black;
                padding: 24px;
                border-radius: 5px;
                box-shadow: 0 5px 30px rgba(black, .1);
            }

            .popover-arrow {
                border-color: $color;
            }
        }

        &[aria-hidden='true'] {
            visibility: hidden;
            opacity: 0;
            transition: opacity .15s, visibility .15s;
        }

        &[aria-hidden='false'] {
            visibility: visible;
            opacity: 1;
            transition: opacity .15s;
        }
    }

</style>
