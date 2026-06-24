{
  description = "Development environment for Next.js project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system: let
    pkgs = import nixpkgs { inherit system; };
  in {
    devShell = pkgs.mkShell {
      name = "nextjs-dev-env";

      buildInputs = [
        pkgs.nodejs_22
        pkgs.nodePackages.npm
        pkgs.nodePackages.typescript
        pkgs.nodePackages.typescript-language-server
      ];

      shellHook = ''
        echo "Welcome to the Next.js development environment!"
      '';
    };
  });
}