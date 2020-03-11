FROM mcr.microsoft.com/dotnet/core/sdk:3.1
RUN dotnet tool install watch -g
WORKDIR app
COPY Stopwatch.Tests.csproj /app/
RUN dotnet restore
CMD ["dotnet", "test"]
