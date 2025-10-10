# CustBuilt specifically for GoDeskless Inc. to provide comprehensive customer insights and analytics. This platform enables our team to monitor customer health scores, track engagement patterns, manage support relationships, and drive business growth through data-driven decisions.

The platform combines modern web technologies with intuitive design to create a powerful tool for customer success management.

> **Internal Portal:** Customer Health Portal - GoDeskless Inc.Health Portal - GoDeskless Inc.

**Customer Health Portal** - Comprehensive customer management and analytics platform for monitoring customer health, tracking engagement, and managing relationships with advanced insights.

<img src="https://github.com/arhamkhnz/next-shadcn-admin-dashboard/blob/main/media/dashboard.png?version=4" alt="Dashboard Screenshot">

Most admin templates I found, free or paid, felt cluttered, outdated, or too rigid. I built this as a cleaner alternative with features often missing in others, such as theme toggling and layout controls, while keeping the design modern, minimal, and flexible.

I’ve taken design inspiration from various sources. If you’d like credit for something specific, feel free to open an issue or reach out.

> **View demo:** [studio admin](https://next-shadcn-admin-dashboard.vercel.app)

> [!TIP]
> I’m also working on Nuxt.js, Svelte, and React (Vite + TanStack Router) versions of this dashboard. They’ll be live soon.

## Features

- **Customer Health Monitoring** - Real-time health scores and engagement tracking
- **Advanced Analytics** - Customer lifecycle, revenue, and churn prediction analytics  
- **Support Integration** - Ticket management and customer communication history
- **Responsive Design** - Mobile-first approach with customizable themes
- **Modern Tech Stack** - Built with Next.js 15, TypeScript, Tailwind CSS v4, and Shadcn UI
- **Flexible Layouts** - Collapsible sidebar with multiple layout options
- **Secure Authentication** - Multi-factor authentication and role-based access control
- **Real-time Updates** - Live data synchronization and instant notifications  

> [!NOTE]
> The default dashboard uses the **shadcn neutral** theme.  
> It also includes additional color presets inspired by [Tweakcn](https://tweakcn.com):  
>
> - Tangerine  
> - Neo Brutalism  
> - Soft Pop  
>
> You can create more presets by following the same structure as the existing ones.  

> Looking for the **Next.js 14 + Tailwind CSS v3** version?  
> Check out the [`archive/next14-tailwindv3`](https://github.com/arhamkhnz/next-shadcn-admin-dashboard/tree/archive/next14-tailwindv3) branch.  
> It has a different color theme and is not actively maintained, but I try to keep it updated with major changes.  

## Tech Stack

- **Framework**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4  
- **UI Components**: Shadcn UI  
- **Validation**: Zod  
- **Forms & State Management**: React Hook Form, Zustand  
- **Tables & Data Handling**: TanStack Table  
- **Tooling & DX**: ESLint, Prettier, Husky  

## Platform Modules

### Core Features
- Customer Health Dashboard
- Customer Management Interface
- Analytics & Reporting
- Support Ticket Management
- Authentication & Security

### Advanced Features
- Health Score Calculator
- Churn Prediction Analytics
- Revenue Forecasting
- Engagement Tracking
- Automated Alerts
- Custom Report Builder
- Integration Hub
- User Management
- Audit Logs  

## Colocation File System Architecture

This project follows a **colocation-based architecture** each feature keeps its own pages, components, and logic inside its route folder.  
Shared UI, hooks, and configuration live at the top level, making the codebase modular, scalable, and easier to maintain as the app grows.

For a full breakdown of the structure with examples, see the [Next Colocation Template](https://github.com/arhamkhnz/next-colocation-template).

## Getting Started

You can run this project locally, or deploy it instantly with Vercel.

### Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farhamkhnz%2Fnext-shadcn-admin-dashboard)

_Deploy your own copy with one click._

### Run locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/arhamkhnz/next-shadcn-admin-dashboard.git
   ```
   
2. **Navigate into the project**
   ```bash
    cd next-shadcn-admin-dashboard
   ```
   
3. **Install dependencies**
   ```bash
    npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

Your app will be running at [http://localhost:3000](http://localhost:3000)

---

> [!IMPORTANT]  
> This project is updated frequently. If you’re working from a fork or an older clone, pull the latest changes before syncing. Some updates may include breaking changes.

---

Contributions are welcome. Feel free to open issues, feature requests, or start a discussion.


**Happy Vibe Coding!**
