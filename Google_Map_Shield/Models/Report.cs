using System.ComponentModel.DataAnnotations;

namespace Google_Map_Shield.Models
{
    public class Report
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "The title is required.")]
        [MaxLength(15, ErrorMessage = "The title cannot exceed 15 characters.")]
        public string? title { get; set; }
        public string? email { get; set; }

        [Required(ErrorMessage = "The description is required.")]
        public string? description { get; set; }
        public IFormFile? vidpicproof { get; set; }
        public string? vidpicproofath { get; set; }

        [Required(ErrorMessage = "The review type is required.")]
        public string? review_type { get; set; }

        public int? points { get; set; }
        public string? UserType { get; set; }

        [Required(ErrorMessage = "From latitude is required.")]
        public decimal? fromlatitude { get; set; }

        [Required(ErrorMessage = "From longitude is required.")]
        public decimal? fromlongitude { get; set; }

        [Required(ErrorMessage = "To longitude is required.")]
        public decimal? tolongitude { get; set; }

        [Required(ErrorMessage = "To latitude is required.")]
        public decimal? tolatitude { get; set; }
    }
}
