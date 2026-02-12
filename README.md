# Task Gen - AI Feature Scaffolding

## Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB instance
- Google OAuth credentials
- Google Gemini API Key

### Setup
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Configure Environment Variables: Copy `.env.example` to `.env` and fill in your credentials.
4. Run in Development Mode: `pnpm dev`
5. Build for production: `pnpm build`
6. Run in production: `node build/index.js`


### What is done
- **AI Task Generation**: Full conversion of feature descriptions into technical tasks and user stories.
- **Spec Management**: View history and manage multiple feature specifications.
- **Authentication**: Google login via Auth.js.
- **Persistence**: Specs and history are stored in MongoDB.
- **Refinement**: Edit and organize generated tasks in a Kanban view.

### What is not done
- **Export Options**: Exporting tasks to PDF (MD is done).
- **Real-time Collaboration**: Multi-user editing on the same spec.
- **Custom Model Selection**: Support for other LLMs (Claude, GPT-4, etc.).
