package cmd

import (
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"math"
	"net/http"
	"os"
	"sort"
	"strconv"
	"time"

	"github.com/spf13/cobra"
)

// profileCmd represents the profile command
var profileCmd = &cobra.Command{
	Use:   "profile [integer] [url]",
	Short: "Measure the stats of a url",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 2 {
			return errors.New("Error: Require a two arguments in form of: [integer] [url]")
		}
		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		num, err := strconv.Atoi(args[0])
		if err != nil {
			fmt.Println("Error: Require a two arguments in form of: [integer] [url]")
			os.Exit(2)
		}

		times := []int{}
		succ := 0
		errors := []error{}
		var maxSize, minSize int64

		url := args[1]
		fmt.Printf("Number of Requests: %d\n", num)
		for i := 0; i < num; i++ {
			t := time.Now()
			res, err := http.Get(url)
			if err != nil {
				errors = append(errors, err)
			} else {
				defer res.Body.Close()
				b, err := io.Copy(ioutil.Discard, res.Body)
				if err != nil {
					errors = append(errors, err)
				}
				if i == 0 {
					maxSize, minSize = b, b
				} else {
					if b > maxSize {
						maxSize = b
					} else if b < minSize {
						minSize = b
					}
				}
			}
			succ++
			currTime := time.Now()
			diff := currTime.Sub(t)
			secs := int(diff.Seconds())

			times = append(times, secs)
		}
		minMaxMeanMedian := getMinMaxMeanMedian(times)
		fmt.Printf("Fastest Time: %d sec\nSlowest Time: %d sec\nMean: %d\nMedian: %d\n", minMaxMeanMedian[0], minMaxMeanMedian[1], minMaxMeanMedian[2], minMaxMeanMedian[3])
		fmt.Printf("Percenteage of requests succeeded: %d\n", succ/num*100)
		fmt.Printf("Error Codes: %s\n", fmt.Sprint(errors))
		fmt.Printf("Max Size: %d\nMin Size: %d\n", maxSize, minSize)
	},
}

// Min retrun Minimum of two values
func Min(x, y int) int {
	if x < y {
		return x
	}
	return y
}

// Max return maximum of two values
func Max(x, y int) int {
	if x > y {
		return x
	}
	return y
}

func getMinMaxMeanMedian(ar []int) []int {
	sort.Ints(ar)
	mid := len(ar) / 2
	median := 0
	if len(ar)%2 == 1 {
		median = ar[mid]
	} else {
		median = (ar[mid-1] + ar[mid]) / 2
	}

	min, max, total := math.MaxInt64, math.MinInt64, 0

	for _, val := range ar {
		min, max = Min(min, val), Max(max, val)
		total += val
	}

	return []int{min, max, total / len(ar), median}
}

func init() {
	rootCmd.AddCommand(profileCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// profileCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// profileCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
