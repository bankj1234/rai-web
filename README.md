# Next.js Ant Design TailwindCSS Template

This is a template project for building web applications using Next.js, Ant Design, and TailwindCSS.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Naming Conventions](#naming-conventions)
3. [Project Structure](#project-structure)
4. [Testing](#testing)
5. [Techinical Note](#technical-note)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js v18 or higher
- yarn for package management

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/nextjs-antd-tailwindcss-template.git
cd nextjs-antd-tailwindcss-template
```

2. **Install dependencies:**

```bash
yarn install
```

3. **Run the development server:**

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Naming Conventions

To maintain consistency across the project, adhere to the following naming conventions:

| Type                 | Naming Convention       | Examples                    |
| -------------------- | ----------------------- | --------------------------- |
| Folder Names         | kebab-case              | components/, app/, lib/     |
| Component Files      | PascalCase              | Header.tsx, SidebarMenu.tsx |
| Page Files           | kebab-case              | app/about-us/page.tsx       |
| Layout Files         | kebab-case              | app/layout.tsx              |
| Route Handlers       | kebab-case              | app/api/users/route.ts      |
| Utility/Helper Files | kebab-case              | lib/format-date.ts          |
| Styles               | kebab-case              | styles/global.css           |
| Test Files           | _.test.ts or _.test.tsx | Header.test.tsx             |
| Images and Assets    | kebab-case              | public/images/logo.png      |

## Project Structure

Here’s an overview of the project structure:

```
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout
│   │   ├── template.tsx                # Root template
│   │   ├── page.tsx                    # Home page
│   │   ├── about-us/
│   │   │   └── page.tsx                # About Us page
│   │   └── api/
│   │       ├── users/
│   │       │   └── route.ts            # API route for users
│   │       └── auth/
│   │           └── login/
│   │               └── route.ts        # API route for auth/login
│   ├── components/
│   │   ├── header/
│   │   │   ├── Header.tsx              # Header
│   │   │   ├── Header.test.tsx         # Test Header component
│   │   │   └── header.module.css       # CSS Module for Header
│   │   ├── Footer.tsx                  # Footer component
│   │   └── SidebarMenu.tsx             # Sidebar component
│   ├── lib/
│   │   └── format-date.ts              # Utility function for date formatting
│   ├── styles/
│   │   └── global.css                  # Global styles
├── public/
│   ├── images/
│   │   └── logo.png                    # Image asset
│   └── assets/
│       └── icon-arrow.svg              # SVG asset
├── .eslintrc.json                      # ESLint configuration
├── .gitignore
├── .prettierrc.json
├── next.config.js                      # Next.js configuration
├── package.json
├── README.md                           # Project documentation
└── tailwind.config.js
```

## Testing

The project uses Vitest for testing. Test files are located beside the component

### Running Tests

To run the tests, use the following command:

```bash
yarn test
```

### Extending Testing

To add new tests, create a new file in each directory with the `.test.tsx / .test.ts` extension. Write your test cases using Vitest.

Example test file:

```javascript
import { render, screen } from '@testing-library/react'
import NewComponent from '../components/NewComponent'

it('renders NewComponent', () => {
  render(<NewComponent />)

  const element = screen.getByText(/new component/i)

  expect(element).toBeInTheDocument()
})
```

### Technical Note

1. **Step on credential login:**

```bash
1. Enter authorize function of CredentialProvider
To make api to backend to user info and internal/refresh token

2. Enter Signin callback function

3. Enter JWT callback function to manipulate token

4. Enter Session callback function to manipulate session

```

2. **Step on AD login:**

```bash
1. Enter Signin callback function
to verfiy user account and make api to backend to user info and internal/refresh token

2. Enter JWT callback function to manipulate token

3. Enter Session callback function to manipulate session


```

This template provides a solid foundation for building and testing your Next.js applications with Ant Design and TailwindCSS.
