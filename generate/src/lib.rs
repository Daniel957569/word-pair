mod generate;

#[cfg(test)]
mod tests {
    use crate::generate::Words;

    #[test]
    fn test_get_words() {
        let words = Words::get_words("./test_words.txt");
        println!("{:?}", words);

        assert_eq!(words.dutch[0].word, "Gezellig");
        assert_eq!(words.dutch[1].word, "Uitwaaien");

        assert_eq!(words.english[0].word, "Cozy, sociable, pleasant");
        assert_eq!(words.english[1].word, "To go outside and clear one's head");

        assert_eq!(words.english[0].id, 1);
        assert_eq!(words.dutch[0].id, 1);

        assert_eq!(words.english[1].id, 2);
        assert_eq!(words.dutch[1].id, 2);
    }
}
