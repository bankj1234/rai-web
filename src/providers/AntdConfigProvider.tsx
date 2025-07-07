import React from 'react'
import { App, ConfigProvider, ThemeConfig } from 'antd'
import { SCGFont, THSarabunFont } from '@/app/fonts'
import { extendedColors as colors } from '../../tailwind.config'

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorTextSecondary: colors.secondary,
    colorError: colors.error,
    colorWarning: colors.warning,
    ...SCGFont.style,
    ...THSarabunFont.style,
  },
  components: {
    Layout: {
      bodyBg: 'transparent',
    },
    Button: {
      fontWeight: 700,
      defaultBorderColor: colors.primary,
      defaultHoverBg: colors.navy['50'],
      defaultActiveBg: colors.navy['200'],
      paddingBlockLG: 13,
      paddingInlineLG: 24,
      paddingBlock: 13,
      paddingInline: 24,
      primaryShadow: '0 1px 4px rgba(3, 18, 22, 0.48)',
      borderRadiusLG: 4,
    },
    Menu: {
      itemBg: colors.navy['900'],
      itemHoverBg: colors.secondary,
      itemHoverColor: colors.blue['50'],
      itemSelectedBg: colors.secondary,
      itemSelectedColor: colors.blue['50'],
      itemColor: colors.navy['200'],
    },
    Collapse: {
      headerBg: colors.navy['50'],
    },
    Typography: {
      titleMarginBottom: 0,
      titleMarginTop: 0,
      colorTextHeading: colors.primary,
      colorText: colors.primary,
    },
    Input: {
      fontSize: 16,
      colorTextDisabled: colors.primary,
      colorPrimaryHover: colors.navy['200'],
      colorPrimaryActive: colors.navy['200'],
      controlOutline: 'none',
    },
    InputNumber: {
      colorTextDisabled: colors.primary,
      colorPrimaryHover: colors.navy['200'],
      colorPrimaryActive: colors.navy['200'],
      controlOutline: 'none',
    },
    Select: {
      optionPadding: 8,
      fontSize: 16,
      colorTextDisabled: colors.primary,
      controlOutline: 'none',
      optionSelectedBg: colors.blue['50'],
      optionSelectedFontWeight: 'normal',
    },
    DatePicker: {
      colorTextDisabled: colors.primary,
      colorPrimaryHover: colors.navy['200'],
      colorPrimaryActive: colors.navy['200'],
      controlOutline: 'none',
    },
    Divider: {
      margin: 0,
      marginLG: 12,
    },
    Switch: {
      colorPrimary: colors.secondary,
      colorPrimaryHover: colors.secondary,
    },
    Form: {
      itemMarginBottom: 0,
    },
    Table: {
      headerBg: colors.primary,
      headerColor: colors.navy['50'],
      headerSplitColor: 'transparent',
    },
    Alert: {
      marginXS: 0,
    },
  },
}

type Props = Readonly<{
  children: React.ReactNode
}>

const AntdConfigProvider = ({ children }: Props) => (
  <ConfigProvider theme={themeConfig}>
    <App>{children}</App>
  </ConfigProvider>
)

export default AntdConfigProvider
