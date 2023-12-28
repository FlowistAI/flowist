NODE_ENV=development pnpm run build:dev
rm -rfd ../../public/plugins/my-plugin/
cp -r dist/ ../../public/plugins/my-plugin/
