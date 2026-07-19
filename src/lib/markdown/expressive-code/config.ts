import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import {
  createRenderer,
  type SatteriExpressiveCodeOptions,
} from 'satteri-expressive-code'

export const ecOptions: SatteriExpressiveCodeOptions = {
  themes: ['gruvbox-light-soft', 'gruvbox-dark-soft'],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) =>
    `[data-theme="${theme.name === 'gruvbox-dark-soft' ? 'dark' : 'light'}"]`,
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
  defaultProps: {
    wrap: true,
    showLineNumbers: true,
    collapseStyle: 'collapsible-auto',
    overridesByLang: {
      'ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh':
        {
          showLineNumbers: false,
        },
    },
  },
  styleOverrides: {
    codeFontSize: '0.75rem',
    codeFontFamily: 'var(--font-mono)',
    codeBackground: 'color-mix(in oklab, var(--secondary) 25%, transparent)',
    borderColor: 'var(--border)',
    borderRadius: '0',
    uiFontFamily: 'var(--font-serif)',
    lineNumbers: {
      foreground: 'var(--muted-foreground)',
    },
    frames: {
      editorActiveTabForeground: 'var(--muted-foreground)',
      editorActiveTabBackground:
        'color-mix(in oklab, var(--secondary) 25%, transparent)',
      editorActiveTabIndicatorBottomColor: 'transparent',
      editorActiveTabIndicatorTopColor: 'transparent',
      editorTabBorderRadius: '0',
      editorTabBarBackground: 'transparent',
      editorTabBarBorderBottomColor: 'transparent',
      frameBoxShadowCssValue: 'none',
      terminalBackground:
        'color-mix(in oklab, var(--secondary) 25%, transparent)',
      terminalTitlebarBackground: 'transparent',
      terminalTitlebarBorderBottomColor: 'transparent',
      terminalTitlebarForeground: 'var(--muted-foreground)',
    },
    collapsibleSections: {
      closedFontFamily: 'var(--font-serif)',
    },
  },
}

export const ecRenderer = createRenderer(ecOptions)
