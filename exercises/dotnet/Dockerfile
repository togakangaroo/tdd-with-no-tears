FROM mcr.microsoft.com/dotnet/core/sdk:2.2
WORKDIR app
COPY Stopwatch.Tests.csproj /app/
RUN dotnet restore
CMD ["dotnet", "test"]
