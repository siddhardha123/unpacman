
# Unpacman
**unpacman** is a simple CLI tool to calculate and display the unpacked sizes of all dependencies in a `package.json` file. It highlights large package sizes, making it easier for developers to analyze dependency sizes directly from the terminal.

![npm](https://img.shields.io/npm/v/unpacman) ![License](https://img.shields.io/npm/l/unpacman) ![Downloads](https://img.shields.io/npm/dt/unpacman) ![TypeScript](https://badgen.net/badge/Built%20With/TypeScript/blue)

---

## Features

- 🎨 **Color-coded Output**: Large dependencies are displayed in red, and smaller ones in green.
- 📊 **Detailed Size Analysis**: Provides the unpacked sizes for all dependencies and a total size summary.
- ⚡ **Quick and Lightweight**: Runs with minimal overhead.
- 🛠️ **Built with TypeScript**: Reliable and type-safe.

---

## Installation

Install `unpacman` globally using `npm`:

```bash
npm install -g unpacman
```

Or run it directly with `npx` (no installation required):

```bash
npx unpacman
```

---

## Usage

Navigate to a project directory containing a `package.json` file and run:

```bash
npx unpacman
```

The output will display:

- The unpacked size of each dependency.
- A color-coded indicator for large (red) and small (green) packages.
- The total unpacked size of all dependencies at the end.






## Contributing

We welcome contributions! Follow these steps to contribute:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/unpacman.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Test your changes:
   ```bash
   npm run start
   ```

Feel free to open issues or submit pull requests with your ideas and fixes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/).
