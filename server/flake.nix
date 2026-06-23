
{
  description = "Dotnet development environment";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      # Gộp các thành phần dotnet lại một chỗ
      dotnet-combined =
        with pkgs.dotnetCorePackages;
        combinePackages [
          sdk_8_0
          aspnetcore_8_0
        ];
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          dotnet-combined
          roslyn-ls
          dotnet-ef
          sqlcmd
          # Quan trọng: Đảm bảo có bộ thư viện chuẩn cho Linux
          icu
          openssl
          zlib
        ];

        shellHook = ''
          export DOTNET_ROOT="${dotnet-combined}";
          export MSBuildSDKsPath=$(ls -d ${dotnet-combined}/share/dotnet/sdk/8.0.*/Sdks | head -n 1)
          export LD_LIBRARY_PATH="${
            pkgs.lib.makeLibraryPath [
              pkgs.stdenv.cc.cc
              pkgs.openssl
              pkgs.icu
              pkgs.zlib
            ]
          }:$LD_LIBRARY_PATH"
          export PATH="$PATH:$HOME/.dotnet/tools"
          echo "MSBuildSDKsPath set to: $MSBuildSDKsPath"
          echo ".NET 8 Dev Shell (Roslyn-ready) Active"
        '';
      };
    };
}

