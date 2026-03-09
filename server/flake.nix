{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      pkgs = nixpkgs.legacyPackages.x86_64-linux;
    in
    {
      devShells.x86_64-linux.default = pkgs.mkShell {
        packages = [
          pkgs.dotnet-sdk_8
          pkgs.omnisharp-roslyn
          pkgs.dotnet-ef
          pkgs.sqlcmd
        ];

        # Fix dotnet hay bị lỗi SSL trên NixOS
        env.DOTNET_ROOT = "${pkgs.dotnet-sdk_8}";
      };
    };
}
