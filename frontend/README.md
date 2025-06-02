# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

## Running eslint Style checker

```bash
  npx eslint .
```

## Linting

This project uses ESLint for code quality and style consistency. The following linting commands are available:

```shellscript
# Run linting with caching for development
npm run lint

# Generate a JSON lint report (used by SonarQube)
npm run lint:report
```

The ESLint configuration can be found in `.eslintrc.cjs`.

## SonarQube Integration

This project includes SonarQube integration for code quality analysis. To run the analysis:

### Prerequisites
- SonarQube server running (default: http://localhost:9000)
- SonarQube access token
- `curl` installed (for API communication)
- `jq` installed (optional, for better API handling)

### Running SonarQube Analysis

```shellscript
# Run with token as argument
./run-sonar.sh YOUR_SONAR_TOKEN

# Or set the token as environment variable
export SONAR_TOKEN=YOUR_SONAR_TOKEN
npm run sonar

# Or create a sonar-token.txt file (gitignored)
echo "YOUR_SONAR_TOKEN" > sonar-token.txt
npm run sonar
```

The script will:
1. Check if the project exists in SonarQube and create it if needed
2. Generate an ESLint report
3. Run the SonarQube scanner
4. Provide a link to view results

