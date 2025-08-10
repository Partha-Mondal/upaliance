# **App Name**: FormForge AI

## Core Features:

- Dynamic Form Creation: Enable users to create forms with customizable fields like text inputs, dropdowns, and checkboxes. Validation rules like required fields, email format, and number ranges should be implemented.
- Real-Time Form Preview: Provide a real-time form preview to visualize the end-user experience. The preview should display how the form looks and behaves with different field configurations.
- AI-Driven Interactive Decision Support: Implement an interactive component that guides the user through the choices, generating an output or determining which of a number of canned actions will be executed based on a series of UI choices. Use the LLM tool to provide reasoning for what decision to make, and communicate this to the user through effective data presentation and UI.
- Form List Management: Offer an overview page showcasing a list of saved forms with details like name, creation date, and last modified date. The UI will also allow editing or deleting existing forms.
- Form Persistence: Store all form configurations in the browser's localStorage. When localStorage is reset, this tool will notify the user and take them to a guided onboarding page, rather than crashing.

## Style Guidelines:

- Primary color: Vivid orange (#FF8C00), drawing on upliance.ai's brand, implying a sense of warmth and user-friendliness related to cooking.
- Background color: Light tan (#FAF0E6), a gentle neutral to ensure comfortable contrast with content, reminiscent of kitchen settings.
- Accent color: Muted gold (#B8860B) for subtle highlights and action states; evokes themes of culinary artistry and premium quality.
- Font: 'Inter' (sans-serif) for a clean, modern, and highly readable interface, suitable for both form elements and titles.
- Crisp, outlined icons to represent different field types (text input, dropdown, checkbox), ensuring ease of understanding.
- A clear, modular layout promoting intuitive form creation and preview. Use whitespace to separate sections and guide user attention.