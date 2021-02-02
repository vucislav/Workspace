using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api.Models {
    public class Card {
        [Key]
        public int Id { get; set; }
        
        [StringLength(50, MinimumLength=1)]
        public string Name { get; set; }

        public string Description { get; set; }
        
        [StringLength(10)]
        public string Tag { get; set; }
        
        public int CategoryId { get; set; }
    }
}