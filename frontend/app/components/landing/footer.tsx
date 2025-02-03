export function Footer() {
  return (
    <footer className="border-t dark:border-gray-700 dark:text-gray-500 py-6 text-center">
      <p className="text-sm text-manatee">
        © {new Date().getFullYear()} Bachelor's LifeHub. All rights reserved.
      </p>
    </footer>
  );
}
