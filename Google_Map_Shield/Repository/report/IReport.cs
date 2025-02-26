namespace Google_Map_Shield.Repository.report
{
    public interface IReport
    {
        public Task<string> GetReport(Models.Report report);
    }
}
